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
                    dense
                    label="Base URL"
                    outlined
                    placeholder="http://192.168.1.1"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model.number="apiPort"
                    dense
                    label="API Port"
                    outlined
                    placeholder="7048"
                    type="number"
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="instanceName"
                    dense
                    label="Instance Name"
                    outlined
                    placeholder="JVL-LIVE"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="companyId"
                    dense
                    label="Company ID"
                    outlined
                    placeholder="e3e063a7-5d79-ef11-a06b-00155d0a0105"
                  />
                </v-col>
              </v-row>

              <!-- API Configuration -->
              <v-divider class="my-4" />

              <h3>API Configuration</h3>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="apiPublisher"
                    dense
                    label="API Publisher"
                    outlined
                    placeholder="fsoft"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="apiGroup"
                    dense
                    label="API Group"
                    outlined
                    placeholder="fpt"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="apiVersion"
                    dense
                    label="API Version"
                    outlined
                    placeholder="v1.0"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="entitySetName"
                    dense
                    label="Entity Set Name"
                    outlined
                    placeholder="itemmasters"
                  />
                </v-col>
              </v-row>
            </v-form>

            <!-- Generated URL Output -->
            <v-divider class="my-4" />

            <v-row>
              <v-col cols="12">
                <h3 class="mb-2">Generated API URL</h3>
                <v-text-field
                  v-model="generatedUrl"
                  append-inner-icon="mdi-content-copy"
                  dense
                  label="API URL"
                  outlined
                  readonly
                  @click:append-inner="copyUrl"
                />
              </v-col>
            </v-row>

            <!-- Information Alert -->
            <v-alert class="mt-4" type="info">
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
    data () {
      return {
        baseUrl: 'http://192.168.1.1',
        apiPort: 7748,
        apiGroup: 'group',
        apiPublisher: 'publisher',
        apiVersion: 'v1.0',
        entitySetName: 'itemmasters',
        instanceName: 'UAT',
        companyId: 'e3e063a7-5d79-ef11-a06b-00155d0a0105',
        generatedUrl: '',
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
      companyId: 'generateUrl',
    },
    mounted () {
      this.generateUrl()
    },
    methods: {
      generateUrl () {
        // API v2 format:
        // http://<baseUrl>:<port>/<serverInstance>/api/<apiPublisher>/<apiGroup>/<apiVersion>/companies(<companyId>)/<entitySetName>
        const url = `${this.baseUrl}:${this.apiPort}/${this.instanceName}/api/${this.apiPublisher}/${this.apiGroup}/${this.apiVersion}/companies(${this.companyId})/${this.entitySetName}`
        this.generatedUrl = url
      },
      copyUrl () {
        if (this.generatedUrl) {
          navigator.clipboard.writeText(this.generatedUrl).then(() => {
            this.$notify({
              group: 'foo',
              title: 'Success',
              text: 'URL copied to clipboard!',
              type: 'success',
            })
          }).catch(() => {
            this.$notify({
              group: 'foo',
              title: 'Error',
              text: 'Failed to copy URL',
              type: 'error',
            })
          })
        }
      },
    },
  }
</script>

<style scoped>
code {
  word-break: break-all;
  white-space: pre-wrap;
}
</style>
