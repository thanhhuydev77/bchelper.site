<template>
  <div class="home-container">
    <!-- Hero Section -->
    <v-container class="hero-section" fluid>
      <v-row justify="center" align="center" class="hero-content">
        <v-col cols="12" md="8" class="text-center">
          <v-avatar size="150" class="mb-6">
            <v-img :src="profileImage" alt="Alex Profile"></v-img>
          </v-avatar>
          <h1 class="text-h2 font-weight-bold mb-4 text-white">
            Hi, I'm Alex
          </h1>
          <p class="text-h5 text-white mb-6">
            Business Central Developer
          </p>
          <p class="text-body-1 text-white mb-8">
            I’ve worked as a Business Central (BC) developer for five years. In the beginning, I often struggled with complex configurations and repetitive tasks—such as importing licenses or changing authentication types. To streamline my workflow, I built a custom website that leverages AI to automate and simplify these operations. It has significantly improved my efficiency and reduced the time spent on manual setup
          </p>
          
          <!-- Social Media Links -->
          <div class="social-links mb-8">
            <v-btn
              :href="socialLinks.linkedin"
              target="_blank"
              color="primary"
              size="large"
              class="mr-4"
              prepend-icon="mdi-linkedin"
            >
              LinkedIn
            </v-btn>
            <v-btn
              :href="socialLinks.facebook"
              target="_blank"
              color="primary"
              size="large"
              prepend-icon="mdi-facebook"
            >
              Facebook
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profileImage: "/src/assets/avatar.jpg",
      socialLinks: {
        linkedin: "https://www.linkedin.com/in/alexha77/",
        facebook: "https://www.facebook.com/thanhhuydev"
      }
    };
  }
}
</script>

<style scoped>
.home-container {
  height: 90vh;
  overflow: hidden;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 90vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.embeds-section {
  padding: 80px 0;
  background-color: #f5f5f5;
}

.embed-card {
  height: 100%;
  transition: transform 0.3s ease;
}

.embed-card:hover {
  transform: translateY(-5px);
}

.linkedin-embed,
.facebook-embed {
  border-radius: 8px;
  overflow: hidden;
}

.services-section {
  padding: 80px 0;
  background-color: white;
}

.service-card {
  height: 100%;
  transition: transform 0.3s ease;
  border-left: 4px solid #1976d2;
}

.service-card:hover {
  transform: translateY(-5px);
}

.contact-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.social-links .v-btn {
  margin: 0 8px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-section {
    height: 100vh;
  }
  
  .social-links .v-btn {
    margin: 4px;
    width: 100%;
    max-width: 200px;
  }
}
</style>