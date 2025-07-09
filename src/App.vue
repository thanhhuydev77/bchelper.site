<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
      :temporary="drawerType"
      theme="dark"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle>
            <strong>On-Premise</strong>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list dense nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.url"
        />
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dark prominent src="https://picsum.photos/1920/1080?random">
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"></v-img>
      </template>
      <v-app-bar-nav-icon style="cursor: pointer;" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title @click="goToHome">BC Configuration Helper</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: true,
      items: [
        {
          title: "Enable Development",
          icon: "mdi-dev-to",
          url: "/BCEnableDevMode",
        },
        {
          title: "Apply License",
          icon: "mdi-license",
          url: "BCImportLicense",
        },
        {
          title: "Enable Integration",
          icon: "mdi-api",
          url: "BCEnableIntegration",
        },
        {
          title: "Change Authentication Type",
          icon: "mdi-account-convert",
          url: "BCChangeAuthType",
        },
        {
          title: "Add BC Instance",
          icon: "mdi-plus-circle",
          url: "BCAddInstance",
        },
        {
          title: "Add New User",
          icon: "mdi-account-plus",
          url: "BCAddNewUser",
        },
        {
          title: "Build API URL",
          icon: "mdi-link-variant",
          url: "/BCBuildApiUrl",
        },
      ],
      right: null,
      isMobile: window.innerWidth < 960,
    };
  },
  computed: {
    drawerType () {
      return this.isMobile ? 'temporary' : 'permanent';
    }
  },
  mounted () {
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    goToHome () {
      this.$router.push('/');
    },
    handleResize () {
      this.isMobile = window.innerWidth < 960;
      if (this.isMobile) {
        this.drawer = false;
      } else {
        this.drawer = true;
      }
    }
  }
};
</script>
<style>
html {
  overflow-y: auto;
}

/* Responsive global padding/margin for mobile */
@media (max-width: 600px) {
  .pa-2, .ma-0, .v-container {
    padding-left: 4px !important;
    padding-right: 4px !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}
</style>
