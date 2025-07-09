<template>
  <div class="pa-2">
    <v-container class="ma-0">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="baseUrl"
            label="Base Url"
            placeholder="http://172.16.121.6"
            solo
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="apiPort"
            label="API Port"
            placeholder="7048"
            type="number"
            solo
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="instanceName"
            label="Instance Name"
            placeholder="JVL-LIVE"
            solo
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="companyId"
            label="Company Id"
            placeholder="e3e063a7-5d79-ef11-a06b-00155d0a0105"
            solo
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="apiPublisher"
            label="API Publisher"
            placeholder="fsoft"
            solo
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="apiGroup"
            label="API Group"
            placeholder="fpt"
            solo
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="apiVersion"
            label="API Version"
            placeholder="v1.0"
            solo
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="entitySetName"
            label="Entity Set Name"
            placeholder="itemmasters"
            solo
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="generatedUrl"
            label="Generated API URL"
            readonly
            append-inner-icon="mdi-content-copy"
            @click:append-inner="copyToClipboard"
            solo
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { useClipboardCopy } from "@/composables/useClipboard";

export default {
  data() {
    return {
      baseUrl: "http://192.00.100.1",
      apiPort: "7748",
      apiGroup: "group",
      apiPublisher: "publisher",
      apiVersion: "v1.0",
      entitySetName: "itemmasters",
      instanceName: "UAT",
      companyId: "e3e063a7-5d79-ef11-a06b-00155d0a0105",
      generatedUrl: "",
    };
  },
  watch: {
    baseUrl: "generateUrl",
    apiPort: "generateUrl",
    apiGroup: "generateUrl",
    apiPublisher: "generateUrl",
    apiVersion: "generateUrl",
    entitySetName: "generateUrl",
    instanceName: "generateUrl",
    companyId: "generateUrl",
  },
  methods: {
    generateUrl() {
      // API v2 format:
      // http://<baseUrl>:<port>/<serverInstance>/api/<apiPublisher>/<apiGroup>/<apiVersion>/companies(<companyId>)/<entitySetName>
      let url = `${this.baseUrl}:${this.apiPort}/${this.instanceName}/api/${this.apiPublisher}/${this.apiGroup}/${this.apiVersion}/companies(${this.companyId})/${this.entitySetName}`;
      this.generatedUrl = url;
    },
    async copyToClipboard() {
      const { copyToClipboard } = useClipboardCopy();
      const result = await copyToClipboard(this.generatedUrl);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    },
  },
  mounted() {
    this.generateUrl();
  },
};
</script>
