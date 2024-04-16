<template>
    <div id="screen" class="h-full w-full" />
</template>

<script setup>
import RFB from '@novnc/novnc/core/rfb';
// import { useElementSize } from '@vueuse/core';

// eslint-disable-next-line vue/require-prop-types
const props = defineProps(['port', 'password', 'viewOnly']);

// const { height, width } = useElementSize(el);

let rfb;
let desktopName;

// When this function is called we have
// successfully connected to a server
function connectedToServer() {
    status("Connected to " + desktopName);
}

// This function is called when we are disconnected
function disconnectedFromServer(e) {
    if (e.detail.clean) {
        status("Disconnected");
    } else {
        status("Something went wrong, connection is closed");
    }
}

// When this function is called, the server requires
// credentials to authenticate
function credentialsAreRequired() {
    const password = prompt("Password Required:");
    rfb.sendCredentials({ password: password });
}

// When this function is called we have received
// a desktop name from the server
function updateDesktopName(e) {
    desktopName = e.detail.name;
}

// Show a status text in the top bar
function status(text) {
    console.info(text);
}

watch(props, () => {
    if (!props.port || !props.password) return;
    status("Connecting");
    const host = window.location.hostname;
    const port = props.port;
    const password = props.password;
    const url = `${window.location.protocol === "https:" ? "wss" : "ws"}://${host}:8000/api/ws/${port}`;
    // Creating a new RFB object will start a new connection
    rfb = new RFB(document.getElementById("screen"), url,
        { credentials: { password: password } });

    // Add listeners to important events from the RFB module
    rfb.addEventListener("connect", connectedToServer);
    rfb.addEventListener("disconnect", disconnectedFromServer);
    rfb.addEventListener("credentialsrequired", credentialsAreRequired);
    rfb.addEventListener("desktopname", updateDesktopName);

    // Set parameters that can be changed on an active connection
    rfb.viewOnly = props.viewOnly ?? false;
    // rfb.scaleViewport = props.scaleViewport ?? false;
    rfb.scaleViewport = true;
    rfb.clipViewport = true;
    rfb.resizeSession = true;
}, { deep: true, });

</script>