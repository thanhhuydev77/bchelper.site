<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="12">
        <h1 class="mb-4">Add Instance</h1>
        <v-card>
          <v-card-text>
            <v-form>
              <!-- Basic Configuration -->
              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="version"
                    :items="versionOptions"
                    label="Platform Version"
                    outlined
                    dense
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="instanceName"
                    label="Instance Name"
                    placeholder="e.g., BC230"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Instance Configuration -->
              <v-divider class="my-4"></v-divider>

              <v-row>
                <v-col cols="12">
                  <h3>Instance Configuration</h3>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="authType"
                    :items="authTypeOptions"
                    label="Authentication Type"
                    outlined
                    dense
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="webServerInstance"
                    label="Web Server Instance"
                    placeholder="e.g., BC230"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="databaseServer"
                    label="Database Server"
                    placeholder="localhost"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="databaseName"
                    label="Database Name"
                    placeholder="e.g., BC230"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Service Ports -->
              <v-divider class="my-4"></v-divider>

              <v-row>
                <v-col cols="12">
                  <h3>Service Ports</h3>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="managementServicesPort"
                    label="Management Services Port"
                    type="number"
                    placeholder="12045"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="clientServicesPort"
                    label="Client Services Port"
                    type="number"
                    placeholder="12046"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="soapServicesPort"
                    label="SOAP Services Port"
                    type="number"
                    placeholder="12047"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="odataServicesPort"
                    label="OData Services Port"
                    type="number"
                    placeholder="12048"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="developerServicesPort"
                    label="Developer Services Port"
                    type="number"
                    placeholder="12049"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="addFirewallException"
                    label="Add Firewall Exception"
                    color="primary"
                  ></v-switch>
                </v-col>
              </v-row>

              <!-- Generate Script -->
              <v-row class="mt-4">
                <v-col cols="12">
                  <v-btn
                    @click="toggleGenerateScript"
                    color="primary"
                    class="mr-2"
                  >
                    Generate Script
                  </v-btn>
                  <v-btn
                    color="secondary"
                    @click="copyScript"
                    :disabled="!generatedScript"
                  >
                    Copy Script
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>

            <v-divider class="my-4" v-if="generatedScript && showScript"></v-divider>

            <div v-if="generatedScript && showScript">
              <h3 class="mb-2">Generated PowerShell Script:</h3>
              <v-card class="bg-grey-lighten-3 pa-4" color="surface">
                <code class="text-caption">{{ generatedScript }}</code>
              </v-card>
              <v-alert type="warning" class="mt-4">
                <strong>⚠️ Important:</strong>
                <ul class="mt-2">
                  <li>This script must be run with Admin privileges</li>
                  <li>It will create a new BC server and web server instance</li>
                  <li>All specified ports must be available</li>
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
  name: 'BCAddInstance',
  data() {
    return {
      version: '230',
      instanceName: 'BC230',
      authType: 'Windows',
      webServerInstance: 'BC230',
      managementServicesPort: 12045,
      clientServicesPort: 12046,
      soapServicesPort: 12047,
      odataServicesPort: 12048,
      developerServicesPort: 12049,
      databaseServer: 'localhost',
      databaseName: 'BC230',
      addFirewallException: true,
      showScript: false,
      generatedScript: '',
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
        { title: '280', value: '280' }
      ],
      authTypeOptions: [
        { title: 'Windows', value: 'Windows' },
        { title: 'NavUserPassword', value: 'NavUserPassword' },
        { title: 'AAD', value: 'AAD' }
      ]
    }
  },
  methods: {
    toggleGenerateScript() {
      if (!this.generatedScript) {
        this.generateScript()
      }
      this.showScript = !this.showScript
    },
    generateScript() {
      const versionPath = this.version
      let script = `Import-Module 'C:\\Program Files\\Microsoft Dynamics 365 Business Central\\${versionPath}\\Service\\NavAdminTool.ps1'|Out-Null;\n`
      
      script += `Write-Host 'Creating new server instance...';\n`
      script += `New-NAVServerInstance -ManagementServicesPort ${this.managementServicesPort} -ServerInstance ${this.instanceName} -ClientServicesCredentialType ${this.authType} -ClientServicesPort ${this.clientServicesPort} -DatabaseName ${this.databaseName} -DatabaseServer ${this.databaseServer} -DeveloperServicesPort ${this.developerServicesPort} -ODataServicesPort ${this.odataServicesPort} -SOAPServicesPort ${this.soapServicesPort};\n`
      
      script += `Write-Host 'Starting server instance...';\n`
      script += `Start-NAVServerInstance -ServerInstance ${this.instanceName};\n`
      
      script += `Write-Host 'Creating web server instance...';\n`
      const firewallParam = this.addFirewallException ? ' -AddFirewallException' : ''
      script += `New-NAVWebServerInstance -Server ${this.databaseServer} -ServerInstance ${this.instanceName} -WebServerInstance ${this.webServerInstance}${firewallParam} -ClientServicesCredentialType ${this.authType} -ClientServicesPort ${this.clientServicesPort} -ManagementServicesPort ${this.managementServicesPort} -SiteDeploymentType SubSite;\n`
      
      script += `Write-Host 'New instance created successfully!';\n`

      this.generatedScript = script
    },
    copyScript() {
      if (this.generatedScript) {
        navigator.clipboard.writeText(this.generatedScript).then(() => {
          this.$notify({
            group: 'foo',
            title: 'Success',
            text: 'Script copied to clipboard!',
            type: 'success'
          })
        }).catch(() => {
          this.$notify({
            group: 'foo',
            title: 'Error',
            text: 'Failed to copy script',
            type: 'error'
          })
        })
      }
    }
  },
  watch: {
    version(newVal) {
      this.instanceName = `BC${newVal}`
      this.webServerInstance = `BC${newVal}`
      this.databaseName = `BC${newVal}`
      this.generateScript()
    }
  },
  mounted() {
    this.generateScript()
  }
}
</script>

<style scoped>
code {
  word-break: break-all;
  white-space: pre-wrap;
}
</style> 