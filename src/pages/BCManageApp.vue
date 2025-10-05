<template>
  <div class="pa-2">
    <v-container class="ma-0">
      <v-row>
        <v-col cols="12" md="3">
          <v-combobox
            v-model="Version"
            label="Platform Version"
            :items="['190', '200', '210', '220', '230', '240', '250', '260', '270', '280']"
            v-on:blur="onChange($event)"
            solo
          ></v-combobox>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="Instance"
            type="text"
            label="Instance Name"
            placeholder="BC260"
            required
            solo
            v-on:change="onChange($event)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="SelectedActions"
            :items="Actions"
            label="Actions"
            multiple
            chips
            closable-chips
            solo
            v-on:change="onChange($event)"
          ></v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="AppPath"
            type="text"
            label="App File Path (for Publish)"
            placeholder="C:\\Apps\\YourApp.app"
            :disabled="!requiresAppPath"
            required
            solo
            v-on:change="onChange($event)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="AppName"
            type="text"
            label="App Name (for Install/Uninstall/Unpublish)"
            placeholder="YourAppName"
            :disabled="!requiresAppName"
            required
            solo
            v-on:change="onChange($event)"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>

    <v-textarea 
      label="Generated Script" 
      v-model="GeneratedScript"
      v-on:beforeMount="onLoad($event)"
      append-inner-icon="mdi-content-copy"
      @click:append-inner="copyToClipboard"
    ></v-textarea>

    <br>
    <br>
    <label style="color: red;"><i>** With PowerShell, Need to be run by Admin priviledge.</i></label>
    <notifications group="foo" />
  </div>
</template>
<script>
import { useClipboardCopy } from '@/composables/useClipboard'

export default {
  data() {
    return {
      Version: 260,
      Instance: 'BC260',
      SelectedActions: ['Publish', 'Install'],
      Actions: ['Publish', 'Unpublish', 'Install', 'Uninstall'],
      AppPath: 'C\\Apps\\YourApp.app',
      AppName: 'YourAppName',
      GeneratedScript: '',
      GeneratedBATScript: ''
    }
  },
  computed: {
    requiresAppPath() {
      return this.SelectedActions.includes('Publish')
    },
    requiresAppName() {
      return this.SelectedActions.some(a => a === 'Unpublish' || a === 'Install' || a === 'Uninstall')
    }
  },
  methods: {
    generateScriptManageApp() {
      var Script1 = "Import-Module 'C:\\Program Files\\Microsoft Dynamics 365 Business Central\\" + this.Version + "\\Service\\NavAdminTool.ps1'|Out-Null;\n"

      var Script2 = ''
      for (const action of this.SelectedActions) {
        if (action === 'Publish') {
          const sanitizedPath = (this.AppPath || '').replaceAll('"','')
          Script2 += "Publish-NAVApp -ServerInstance '" + this.Instance + "' -Path '" + sanitizedPath + "' -SkipVerification;\n"
        }
        if (action === 'Unpublish') {
          Script2 += "Unpublish-NAVApp -ServerInstance '" + this.Instance + "' -Name '" + (this.AppName || '') + "';\n"
        }
        if (action === 'Install') {
          Script2 += "Install-NAVApp -ServerInstance '" + this.Instance + "' -Name '" + (this.AppName || '') + "';\n"
        }
        if (action === 'Uninstall') {
          Script2 += "Uninstall-NAVApp -ServerInstance '" + this.Instance + "' -Name '" + (this.AppName || '') + "';\n"
        }
      }

      this.GeneratedScript = Script1 + Script2

      var BATPrefix = 'powershell -Command "& { '
      var BATSuffix = " } set /p=All Done.;pause"
      this.GeneratedBATScript = BATPrefix + Script1 + Script2 + BATSuffix
    },
    onChange() {
      this.generateScriptManageApp()
    },
    onLoad() {
      this.generateScriptManageApp()
    },
    async copyToClipboard() {
      const { copyToClipboard } = useClipboardCopy()
      const result = await copyToClipboard(this.GeneratedScript)
      if (result.success) {
        alert(result.message)
      } else {
        alert(result.message)
      }
    },
  },
  watch: {
    SelectedActions: {
      handler() { this.generateScriptManageApp() },
      deep: true
    },
    AppPath() { this.generateScriptManageApp() },
    AppName() { this.generateScriptManageApp() },
    Instance() { this.generateScriptManageApp() },
    Version() {
      this.Instance = 'BC' + this.Version
      this.generateScriptManageApp()
    }
  },
  mounted() {
    this.generateScriptManageApp()
  }
}
</script>



