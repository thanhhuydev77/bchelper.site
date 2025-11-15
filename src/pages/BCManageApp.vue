<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="12">
        <h1 class="mb-4">Manage App</h1>
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
                    placeholder="BC260"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="selectedActions"
                    :items="actionOptions"
                    label="Actions"
                    multiple
                    chips
                    closable-chips
                    outlined
                    dense
                  ></v-select>
                </v-col>
              </v-row>

              <!-- App Configuration -->
              <v-divider class="my-4"></v-divider>

              <h3>App Configuration</h3>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="appPath"
                    label="App File Path (for Publish)"
                    placeholder="C:\\Apps\\YourApp.app"
                    :disabled="!requiresAppPath"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="appName"
                    label="App Name (for Install/Uninstall/Unpublish)"
                    placeholder="YourAppName"
                    :disabled="!requiresAppName"
                    outlined
                    dense
                  ></v-text-field>
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
                  <li>It will execute all selected actions in order</li>
                  <li>Ensure the app file or app name is specified correctly</li>
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
  name: 'BCManageApp',
  data() {
    return {
      version: '260',
      instanceName: 'BC260',
      selectedActions: ['Publish', 'Install'],
      appPath: 'C:\\Apps\\YourApp.app',
      appName: 'YourAppName',
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
      actionOptions: [
        { title: 'Publish', value: 'Publish' },
        { title: 'Unpublish', value: 'Unpublish' },
        { title: 'Install', value: 'Install' },
        { title: 'Uninstall', value: 'Uninstall' }
      ]
    }
  },
  computed: {
    requiresAppPath() {
      return this.selectedActions.includes('Publish')
    },
    requiresAppName() {
      return this.selectedActions.some(a => a === 'Unpublish' || a === 'Install' || a === 'Uninstall')
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
      const versionPath = this.version.slice(0, -1) + '.' + this.version.slice(-1)
      let script = `Import-Module 'C:\\Program Files\\Microsoft Dynamics 365 Business Central\\${versionPath}\\Service\\NavAdminTool.ps1'|Out-Null;\n`
      
      for (let i = 0; i < this.selectedActions.length; i++) {
        const action = this.selectedActions[i]
        if (action === 'Publish') {
          const sanitizedPath = (this.appPath || '').replaceAll('"', '')
          script += `Publish-NAVApp -ServerInstance '${this.instanceName}' -Path '${sanitizedPath}' -SkipVerification;\n`
        }
        if (action === 'Unpublish') {
          script += `Unpublish-NAVApp -ServerInstance '${this.instanceName}' -Name '${this.appName || ''}';\n`
        }
        if (action === 'Install') {
          // Add Sync-NAVApp before Install if Publish is also selected
          if (this.selectedActions.includes('Publish')) {
            script += `Sync-NAVApp -ServerInstance '${this.instanceName}' -Name '${this.appName || ''}' -Mode ForceSync;\n`
          }
          script += `Install-NAVApp -ServerInstance '${this.instanceName}' -Name '${this.appName || ''}';\n`
        }
        if (action === 'Uninstall') {
          script += `Uninstall-NAVApp -ServerInstance '${this.instanceName}' -Name '${this.appName || ''}';\n`
        }
      }

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
    selectedActions: {
      handler() {
        this.generateScript()
      },
      deep: true
    },
    appPath() {
      this.generateScript()
    },
    appName() {
      this.generateScript()
    },
    instanceName() {
      this.generateScript()
    },
    version() {
      this.instanceName = 'BC' + this.version
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



