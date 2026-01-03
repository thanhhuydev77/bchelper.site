<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="12">
        <h1 class="mb-4">Change Authentication Type</h1>
        <v-card>
          <v-card-text>
            <v-form>
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
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="webServerInstance"
                    dense
                    label="Web Server Instance"
                    outlined
                    placeholder="e.g., BC230"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="authType"
                    dense
                    :items="authTypeOptions"
                    label="Authentication Type"
                    outlined
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
                  <li>It will stop the service, change authentication type, and restart</li>
                  <li>Your BC instance will be temporarily unavailable during this process</li>
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
    name: 'BCChangeAuthType',
    data () {
      return {
        version: '230',
        instanceName: 'BC230',
        webServerInstance: 'BC230',
        authType: 'Windows',
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
        authTypeOptions: [
          { title: 'Windows', value: 'Windows' },
          { title: 'NavUserPassword', value: 'NavUserPassword' },
          { title: 'AAD', value: 'AAD' },
        ],
        generatedScript: '',
      }
    },
    watch: {
      version (newVal) {
        this.instanceName = `BC${newVal}`
        this.webServerInstance = `BC${newVal}`
        this.generateScript()
      },
      authType () {
        this.generateScript()
      },
      instanceName () {
        this.generateScript()
      },
      webServerInstance () {
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
        const versionPath = this.version

        let script = `Import-Module 'C:\\Program Files\\Microsoft Dynamics 365 Business Central\\${versionPath}\\Service\\NavAdminTool.ps1'|Out-Null;\n`
        script += `Write-Host 'Stopping server instance...';\n`
        script += `Stop-NAVServerInstance -ServerInstance ${this.instanceName} -Force;\n`
        script += `Write-Host 'Updating server instance configuration...';\n`
        script += `Set-NAVServerConfiguration -ServerInstance ${this.instanceName} -KeyName ClientServicesCredentialType -KeyValue ${this.authType};\n`
        script += `Set-NAVWebServerInstanceConfiguration -WebServerInstance ${this.webServerInstance} -KeyName ClientServicesCredentialType -KeyValue ${this.authType};\n`
        script += `Write-Host 'Starting server instance...';\n`
        script += `Start-NAVServerInstance -ServerInstance ${this.instanceName};\n`
        script += `Write-Host 'Authentication type changed successfully!';`

        this.generatedScript = script
      },
      updateInstance () {
        this.webServerInstance = this.instanceName
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
