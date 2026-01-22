<template>
  <v-card class="nav-card">
    <v-card-text class="pa-6">
      <v-row align="center" justify="center" class="mb-6">
        <v-col cols="auto">
          <v-avatar size="120">
            <v-img :src="profileImage" alt="Profile" />
          </v-avatar>
        </v-col>
      </v-row>
      <h3 class="text-h5 text-center mb-4">About Me</h3>
      <p class="text-body-1 mb-4">
        I'm a Business Central developer with 5+ years of experience. I specialize in creating automation tools and solutions that streamline BC operations and improve efficiency.
      </p>
      <p class="text-body-1 mb-6">
        This tool was built to help developers like me automate repetitive tasks and focus on what matters most - building great solutions for Business Central.
      </p>
      <v-divider class="my-6" />
      <v-row justify="center" class="gap-3">
        <v-col cols="auto">
        <h5 class="text-h5 mb-4">Connect With Me</h5>
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="primary"
            :href="socialLinks.linkedin"
            target="_blank"
            prepend-icon="mdi-linkedin"
          >
            LinkedIn
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'AboutTab',
  data() {
    return {
      profileImage: '/avatar.jpg',
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/alexha77/',
        facebook: 'https://www.facebook.com/thanhhuydev',
      },
    }
  }
}
</script>

<style scoped>
.nav-card {
  border-radius: 0 0 12px 12px;
  box-shadow: none;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}
</style>