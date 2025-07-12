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
            placeholder="BC230"
            required
            solo
            v-on:change="onChange($event)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="BaseUrl"
            type="text"
            label="Default Web Url"
            placeholder="Http://localhost:8080/BC230"
            v-on:change="onChange($event)"
            solo
            required
            @afterRender="onChange($event)"
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

    <br />
    <br />
    <label style="color: red;">
      <i>** With PowerShell, Need to be run by Admin priviledge.</i>
    </label>
    <notifications group="foo" />
  </div>
</template>
  <script>
import { useClipboardCopy } from '@/composables/useClipboard'

export default {
  data() {
    return {
      Version: 230,
      Instance: "BC230",
      BaseUrl: "http://localhost:8080/BC230",
      GeneratedScript: "",
      GeneratedBATScript: ""
    }
  },
  methods: {
    generateScript() {
      var Script1 = "Import-Module 'C:\\Program Files\\Microsoft Dynamics 365 Business Central\\" + this.Version + "\\Service\\NavAdminTool.ps1'|Out-Null;\n"
      var Script2 = 'Set-NAVServerConfiguration -ServerInstance ' + this.Instance + ' -KeyName PublicWebBaseUrl -KeyValue ' + this.BaseUrl + ';\n'
      var Script3 = "Set-NAVServerConfiguration -ServerInstance " + this.Instance + " -KeyName EnableDebugging -KeyValue true;\n"
      var Script4 = "Set-NAVServerConfiguration -ServerInstance " + this.Instance + " -KeyName DeveloperServicesEnabled -KeyValue true;\n"
      var Script5 = "Write-Host 'Restarting Service...';\nRestart-NAVServerInstance -ServerInstance " + this.Instance 

      this.GeneratedScript = Script1 + Script2 + Script3 + Script4 + Script5

      var BATPrefix = 'powershell -Command "& {'
      var BATSuffix = '} set /p=All Done.;pause'
      this.GeneratedBATScript = BATPrefix + Script1 + Script2 + Script3 + Script4 + Script5 + BATSuffix
    },
    onChange() {
      this.generateScript()
    },
    onLoad() {
      this.generateScript()
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
  mounted() {
    this.generateScript()
  }

}
</script>