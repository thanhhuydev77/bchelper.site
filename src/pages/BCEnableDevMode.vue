<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="12">
        <h1 class="mb-4">Enable Development Mode</h1>
        <v-card>
          <v-card-text>
            <v-form @submit.prevent="generateScript">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="version"
                    dense
                    :items="versionOptions"
                    label="Platform Version"
                    outlined
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="instanceName"
                    dense
                    label="Instance Name"
                    outlined
                    placeholder="e.g., BC230"
                    @input="updateInstance"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="baseUrl"
                    dense
                    label="Default Web URL"
                    outlined
                    placeholder="e.g., http://localhost:8080/BC230"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-btn
                    class="mr-2"
                    color="primary"
                    @click="toggleGenerateScript"
                  >
                    Generate Script
                  </v-btn>
                  <v-btn
                    color="secondary"
                    :disabled="!generatedScript"
                    @click="copyScript"
                  >
                    Copy Script
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>

            <v-divider v-if="generatedScript && showScript" class="my-4" />

            <div v-if="generatedScript && showScript">
              <h3 class="mb-2">Generated PowerShell Script:</h3>
              <v-card class="bg-grey-lighten-3 pa-4" color="surface">
                <code class="text-caption">{{ generatedScript }}</code>
              </v-card>
              <v-alert class="mt-4" type="warning">
                <strong>⚠️ Important:</strong>
                <ul class="mt-2">
                  <li>This script must be run with Admin privileges</li>
                  <li>It will enable debugging and developer services on your BC instance</li>
                  <li>The instance will be restarted automatically</li>
                </ul>
              </v-alert>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'BCEnableDevMode',
    data () {
      return {
        version: '230',
        instanceName: 'BC230',
        baseUrl: 'http://localhost:8080/BC230',
        showScript: false,
        versionOptions: [
          { title: '190', value: '190' },
          { title: '200', value: '200' },
          { title: '210', value: '210' },
          { title: '220', value: '220' },
          { title: '230', value: '230' },
          { title: '240', value: '240' },
          { title: '250', value: '250' },
          { title: '260', value: '260' },
          { title: '270', value: '270' },
          { title: '280', value: '280' },
        ],
        generatedScript: '',
      }
    },
    watch: {
      version (newVal) {
        this.instanceName = `BC${newVal}`
        this.baseUrl = `http://localhost:8080/BC${newVal}`
        this.generateScript()
      },
    },
    mounted () {
      this.generateScript()
    },
    methods: {
      toggleGenerateScript () {
        if (!this.generatedScript) {
          this.generateScript()
        }
        this.showScript = !this.showScript
      },
      generateScript () {
        // Use version directly as path (e.g., "230" not "23.0")
        const versionPath = this.version

        const script1 = `Import-Module 'C:\\Program Files\\Microsoft Dynamics 365 Business Central\\${versionPath}\\Service\\NavAdminTool.ps1'|Out-Null;`
        const script2 = `Set-NAVServerConfiguration -ServerInstance ${this.instanceName} -KeyName PublicWebBaseUrl -KeyValue ${this.baseUrl};`
        const script3 = `Set-NAVServerConfiguration -ServerInstance ${this.instanceName} -KeyName EnableDebugging -KeyValue true;`
        const script4 = `Set-NAVServerConfiguration -ServerInstance ${this.instanceName} -KeyName DeveloperServicesEnabled -KeyValue true;`
        const script5 = `Write-Host 'Restarting Service...';`
        const script6 = `Restart-NAVServerInstance -ServerInstance ${this.instanceName}`

        this.generatedScript = `${script1}\n${script2}\n${script3}\n${script4}\n${script5}\n${script6}`
      },
      updateInstance () {
        this.baseUrl = `http://localhost:8080/${this.instanceName}`
      },
      copyScript () {
        if (this.generatedScript) {
          navigator.clipboard.writeText(this.generatedScript).then(() => {
            this.$notify({
              group: 'foo',
              title: 'Success',
              text: 'Script copied to clipboard!',
              type: 'success',
            })
          }).catch(() => {
            this.$notify({
              group: 'foo',
              title: 'Error',
              text: 'Failed to copy script',
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
