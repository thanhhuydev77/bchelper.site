<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="12">
        <h1 class="mb-4">Enable Integration</h1>
        <v-card>
          <v-card-text>
            <v-form>
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
                    @input="updateInstance"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>

              <v-row>
                <v-col cols="12">
                  <h3>OData Configuration</h3>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="odataEnabled"
                    label="Enable OData"
                    color="primary"
                  ></v-switch>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="odataPort"
                    :disabled="!odataEnabled"
                    label="OData Port"
                    placeholder="7048"
                    type="number"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="odataBaseLink"
                    :disabled="!odataEnabled"
                    label="OData Base Link"
                    :placeholder="`http://localhost:${odataPort}/${instanceName}/ODataV4`"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>

              <v-row>
                <v-col cols="12">
                  <h3>API Configuration</h3>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="apiEnabled"
                    label="Enable API"
                    color="primary"
                  ></v-switch>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="apiPort"
                    :disabled="!apiEnabled"
                    label="API Port"
                    placeholder="7048"
                    type="number"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>

              <v-row>
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
                  <li>It will enable OData and API services on your BC instance</li>
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
  name: 'BCEnableIntegration',
  data() {
    return {
      version: '230',
      instanceName: 'BC230',
      odataEnabled: true,
      odataPort: 7048,
      odataBaseLink: 'http://localhost:7048/BC230/ODataV4',
      apiEnabled: true,
      apiPort: 7048,
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
  methods: {
    toggleGenerateScript() {
      if (!this.generatedScript) {
        this.generateScript();
      }
      this.showScript = !this.showScript;
    },
    generateScript() {
      const versionPath = this.version;
      
      let script = `Import-Module 'C:\\Program Files\\Microsoft Dynamics 365 Business Central\\${versionPath}\\Service\\NavAdminTool.ps1'|Out-Null;\n`;
      
      if (this.odataEnabled) {
        script += `Set-NAVServerConfiguration -ServerInstance ${this.instanceName} -KeyName ODataServicesEnabled -KeyValue true;\n`;
        script += `Set-NAVServerConfiguration -ServerInstance ${this.instanceName} -KeyName ODataServicesPort -KeyValue ${this.odataPort};\n`;
        script += `Set-NAVServerConfiguration -ServerInstance ${this.instanceName} -KeyName PublicODataBaseUrl -KeyValue '${this.odataBaseLink}';\n`;
      } else {
        script += `Set-NAVServerConfiguration -ServerInstance ${this.instanceName} -KeyName ODataServicesEnabled -KeyValue false;\n`;
      }
      
      if (this.apiEnabled) {
        script += `Set-NAVServerConfiguration -ServerInstance ${this.instanceName} -KeyName ApiServicesEnabled -KeyValue true;\n`;
        script += `Set-NAVServerConfiguration -ServerInstance ${this.instanceName} -KeyName ApiServicesPort -KeyValue ${this.apiPort};\n`;
      } else {
        script += `Set-NAVServerConfiguration -ServerInstance ${this.instanceName} -KeyName ApiServicesEnabled -KeyValue false;\n`;
      }
      
      script += `Write-Host 'Restarting Service...';\n`;
      script += `Restart-NAVServerInstance -ServerInstance ${this.instanceName}`;
      
      this.generatedScript = script;
    },
    updateInstance() {
      this.odataBaseLink = `http://localhost:${this.odataPort}/${this.instanceName}/ODataV4`;
    },
    copyScript() {
      if (this.generatedScript) {
        navigator.clipboard.writeText(this.generatedScript).then(() => {
          this.$notify({
            group: 'foo',
            title: 'Success',
            text: 'Script copied to clipboard!',
            type: 'success',
          });
        }).catch(() => {
          this.$notify({
            group: 'foo',
            title: 'Error',
            text: 'Failed to copy script',
            type: 'error',
          });
        });
      }
    },
  },
  watch: {
    version(newVal) {
      this.instanceName = `BC${newVal}`;
      this.odataBaseLink = `http://localhost:${this.odataPort}/${this.instanceName}/ODataV4`;
      this.generateScript();
    },
    odataEnabled() {
      this.generateScript();
    },
    odataPort(newVal) {
      this.odataBaseLink = `http://localhost:${newVal}/${this.instanceName}/ODataV4`;
      this.generateScript();
    },
    odataBaseLink() {
      this.generateScript();
    },
    apiEnabled() {
      this.generateScript();
    },
    apiPort() {
      this.generateScript();
    },
    apiBaseLink() {
      this.generateScript();
    },
    instanceName() {
      this.generateScript();
    }
  },
  mounted() {
    this.generateScript();
  }
}
</script>

<style scoped>
code {
  word-break: break-all;
  white-space: pre-wrap;
}
</style>