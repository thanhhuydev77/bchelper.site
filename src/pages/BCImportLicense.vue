<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="12">
        <h1 class="mb-4">Apply License</h1>
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
                    v-model="instance"
                    label="Instance Name"
                    placeholder="e.g., BC230"
                    outlined
                    dense
                    @input="updateInstance"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="licensePath"
                    label="License File Path"
                    placeholder="e.g., E:\\Downloads\\license.bclicense"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>

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
                  <li>Ensure the license file path is correct</li>
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
  name: 'BCImportLicense',
  data() {
    return {
      version: '230',
      instance: 'BC230',
      licensePath: 'E:\\Downloads\\license.bclicense',
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
      const versionPath = this.version.slice(0, -1) + '.' + this.version.slice(-1);
      const script1 = `Import-Module 'C:\\Program Files\\Microsoft Dynamics 365 Business Central\\${versionPath}\\Service\\NavAdminTool.ps1'|Out-Null;`;
      const script2 = `Import-NAVServerLicense -ServerInstance ${this.instance} -LicenseFile "${this.licensePath}";`;
      const script3 = `Write-Host 'Restarting Service...';`;
      const script4 = `Restart-NAVServerInstance -ServerInstance ${this.instance}`;

      this.generatedScript = `${script1}\n${script2}\n${script3}\n${script4}`;
    },
    updateInstance() {
      // Auto-update when instance name changes
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
      this.instance = `BC${newVal}`;
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