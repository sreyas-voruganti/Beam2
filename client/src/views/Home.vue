<template>
  <div class="mt-32">
    <div class="text-center">
      <h2 class="text-6xl font-bold">Welcome to Beam</h2>
      <p class="mt-5 text-3xl">
        <router-link to="/join" class="text-blue-700"
          >Join a Session</router-link
        >
        •
        <router-link to="/host" class="text-blue-700"
          >Host a Session</router-link
        >
      </p>
      <p class="mt-3 text-xl">
        <router-link to="/legal" class="text-blue-700"
          >Legal Information</router-link
        >
      </p>
    </div>
    <div class="mx-auto container max-w-lg mt-6">
      <h3 class="text-3xl font-medium">Why Beam?</h3>
      <ul class="list-disc mt-2 text-xl">
        <li>Beam will always stay 100% free</li>
        <li>Beam is cross platform and requires zero setup</li>
        <li>Beam requires no installation</li>
        <li>
          Beam has powerful features just like other paid class monitoring
          software
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>
