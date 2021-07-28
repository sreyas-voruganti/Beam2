<template>
  <div class="text-center mt-40">
    <h2 class="text-6xl font-bold">Welcome to Beam</h2>
    <p class="mt-5 text-3xl">
      <router-link to="/join" class="text-blue-700">Join a Session</router-link>
      •
      <router-link to="/host" class="text-blue-700">Host a Session</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>
