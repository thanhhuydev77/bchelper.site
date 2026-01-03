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
                  />
                </v-col>
              </v-row>

              <!-- Instance Configuration -->
              <v-divider class="my-4" />

              <v-row>
                <v-col cols="12">
                  <h3>Instance Configuration</h3>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="authType"
                    dense
                    :items="authTypeOptions"
                    label="Authentication Type"
                    outlined
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="webServerInstance"
                    dense
                    label="Web Server Instance"
                    outlined
                    placeholder="e.g., BC230"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="databaseServer"
                    dense
                    label="Database Server"
                    outlined
                    placeholder="localhost"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="databaseName"
                    dense
                    label="Database Name"
                    outlined
                    placeholder="e.g., BC230"
                  />
                </v-col>
              </v-row>

              <!-- Service Ports -->
              <v-divider class="my-4" />

              <v-row>
                <v-col cols="12">
                  <h3>Service Ports</h3>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="managementServicesPort"
                    dense
                    label="Management Services Port"
                    outlined
                    placeholder="12045"
                    type="number"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="clientServicesPort"
                    dense
                    label="Client Services Port"
                    outlined
                    placeholder="12046"
                    type="number"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="soapServicesPort"
                    dense
                    label="SOAP Services Port"
                    outlined
                    placeholder="12047"
                    type="number"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="odataServicesPort"
                    dense
                    label="OData Services Port"
                    outlined
                    placeholder="12048"
                    type="number"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="developerServicesPort"
                    dense
                    label="Developer Services Port"
                    outlined
                    placeholder="12049"
                    type="number"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="addFirewallException"
                    color="primary"
                    label="Add Firewall Exception"
                  />
                </v-col>
              </v-row>

              <!-- Generate Script -->
              <v-row class="mt-4">
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
    data () {
      return {
        version: '230',
        instanceName: 'BC230',
        authType: 'Windows',
        webServerInstance: 'BC230',
        managementServicesPort: 12_045,
        clientServicesPort: 12_046,
        soapServicesPort: 12_047,
        odataServicesPort: 12_048,
        developerServicesPort: 12_049,
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
          { title: '280', value: '280' },
        ],
        authTypeOptions: [
          { title: 'Windows', value: 'Windows' },
          { title: 'NavUserPassword', value: 'NavUserPassword' },
          { title: 'AAD', value: 'AAD' },
        ],
      }
    },
    watch: {
      version (newVal) {
        this.instanceName = `BC${newVal}`
        this.webServerInstance = `BC${newVal}`
        this.databaseName = `BC${newVal}`
        this.generateScript()
      },
      instanceName () {
        this.generateScript()
      },
      authType () {
        this.generateScript()
      },
      webServerInstance () {
        this.generateScript()
      },
      managementServicesPort () {
        this.generateScript()
      },
      clientServicesPort () {
        this.generateScript()
      },
      soapServicesPort () {
        this.generateScript()
      },
      odataServicesPort () {
        this.generateScript()
      },
      developerServicesPort () {
        this.generateScript()
      },
      databaseServer () {
        this.generateScript()
      },
      databaseName () {
        this.generateScript()
      },
      addFirewallException () {
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
