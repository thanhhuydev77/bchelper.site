<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="12">
        <h1 class="mb-4">Build API URL</h1>
        <v-card>
          <v-card-text>
            <v-form>
              <!-- Base Configuration -->
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="baseUrl"
                    label="Base URL"
                    placeholder="http://192.168.1.1"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model.number="apiPort"
                    label="API Port"
                    type="number"
                    placeholder="7048"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="instanceName"
                    label="Instance Name"
                    placeholder="JVL-LIVE"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="companyId"
                    label="Company ID"
                    placeholder="e3e063a7-5d79-ef11-a06b-00155d0a0105"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- API Configuration -->
              <v-divider class="my-4"></v-divider>

              <h3>API Configuration</h3>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="apiPublisher"
                    label="API Publisher"
                    placeholder="fsoft"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="apiGroup"
                    label="API Group"
                    placeholder="fpt"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="apiVersion"
                    label="API Version"
                    placeholder="v1.0"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="entitySetName"
                    label="Entity Set Name"
                    placeholder="itemmasters"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>

            <!-- Generated URL Output -->
            <v-divider class="my-4"></v-divider>

            <v-row>
              <v-col cols="12">
                <h3 class="mb-2">Generated API URL</h3>
                <v-text-field
                  v-model="generatedUrl"
                  label="API URL"
                  readonly
                  append-inner-icon="mdi-content-copy"
                  @click:append-inner="copyUrl"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Information Alert -->
            <v-alert type="info" class="mt-4">
              <strong>ℹ️ API URL Format:</strong>
              <div class="mt-2">
                <code>http://&lt;baseUrl&gt;:&lt;port&gt;/&lt;instance&gt;/api/&lt;publisher&gt;/&lt;group&gt;/&lt;version&gt;/companies(&lt;companyId&gt;)/&lt;entitySet&gt;</code>
              </div>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'BCBuildApiUrl',
  data() {
    return {
      baseUrl: 'http://192.168.1.1',
      apiPort: 7748,
      apiGroup: 'group',
      apiPublisher: 'publisher',
      apiVersion: 'v1.0',
      entitySetName: 'itemmasters',
      instanceName: 'UAT',
      companyId: 'e3e063a7-5d79-ef11-a06b-00155d0a0105',
      generatedUrl: ''
    }
  },
  methods: {
    generateUrl() {
      // API v2 format:
      // http://<baseUrl>:<port>/<serverInstance>/api/<apiPublisher>/<apiGroup>/<apiVersion>/companies(<companyId>)/<entitySetName>
      let url = `${this.baseUrl}:${this.apiPort}/${this.instanceName}/api/${this.apiPublisher}/${this.apiGroup}/${this.apiVersion}/companies(${this.companyId})/${this.entitySetName}`
      this.generatedUrl = url
    },
    copyUrl() {
      if (this.generatedUrl) {
        navigator.clipboard.writeText(this.generatedUrl).then(() => {
          this.$notify({
            group: 'foo',
            title: 'Success',
            text: 'URL copied to clipboard!',
            type: 'success'
          })
        }).catch(() => {
          this.$notify({
            group: 'foo',
            title: 'Error',
            text: 'Failed to copy URL',
            type: 'error'
          })
        })
      }
    }
  },
  watch: {
    baseUrl: 'generateUrl',
    apiPort: 'generateUrl',
    apiGroup: 'generateUrl',
    apiPublisher: 'generateUrl',
    apiVersion: 'generateUrl',
    entitySetName: 'generateUrl',
    instanceName: 'generateUrl',
    companyId: 'generateUrl'
  },
  mounted() {
    this.generateUrl()
  }
}
</script>

<style scoped>
code {
  word-break: break-all;
  white-space: pre-wrap;
}
</style>
