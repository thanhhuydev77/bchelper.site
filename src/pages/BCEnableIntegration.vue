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
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card class="pa-4" variant="outlined">
            <v-card-title class="text-h6">OData</v-card-title>
            <v-row>
              <v-col cols="12" md="3">
                <v-switch
                  v-model="ODataEnabled"
                  color="primary"
                  label="OData Enable"
                  v-on:change="onChange($event)"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="ODataPort"
                  :disabled="!ODataEnabled"
                  label="OData Port"
                  placeholder="7048"
                  solo
                  type="number"
                  v-on:change="onChange($event)"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="ODataBaseLink"
                  :disabled="!ODataEnabled"
                  label="OData Base Link"
                  placeholder="http://localhost:7048/BC230/ODataV4"
                  solo
                  type="text"
                  v-on:change="onChange($event)"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card class="pa-4" variant="outlined">
            <v-card-title class="text-h6">API</v-card-title>
            <v-row>
              <v-col cols="12" md="3">
                <v-switch
                  v-model="APIEnabled"
                  color="primary"
                  label="API Enable"
                  v-on:change="onChange($event)"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="APIPort"
                  :disabled="!APIEnabled"
                  label="API Port"
                  placeholder="7048"
                  solo
                  type="number"
                  v-on:change="onChange($event)"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-textarea
      v-model="GeneratedScript"
      label="Generated Script"
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
      ODataEnabled: true,
      ODataPort: 7048,
      ODataBaseLink: "http://localhost:7048/BC230/ODataV4",
      APIEnabled: true,
      APIPort: 7048,
      GeneratedScript: "",
      GeneratedBATScript: ""
    }
  },
  methods: {
    generateScript() {
      var Script1 = "Import-Module 'C:\\Program Files\\Microsoft Dynamics 365 Business Central\\" + this.Version + "\\Service\\NavAdminTool.ps1'|Out-Null;\n"
      
      var Script2 = ""
      if (this.ODataEnabled) {
        Script2 += "Set-NAVServerConfiguration -ServerInstance " + this.Instance + " -KeyName ODataServicesEnabled -KeyValue true;\n"
        Script2 += "Set-NAVServerConfiguration -ServerInstance " + this.Instance + " -KeyName ODataServicesPort -KeyValue " + this.ODataPort + ";\n"
        Script2 += "Set-NAVServerConfiguration -ServerInstance " + this.Instance + " -KeyName PublicODataBaseUrl -KeyValue '" + this.ODataBaseLink + "';\n"
      } else {
        Script2 += "Set-NAVServerConfiguration -ServerInstance " + this.Instance + " -KeyName ODataServicesEnabled -KeyValue false;\n"
      }
      
      var Script3 = ""
      if (this.APIEnabled) {
        Script3 += "Set-NAVServerConfiguration -ServerInstance " + this.Instance + " -KeyName ApiServicesEnabled -KeyValue true;\n"
        Script3 += "Set-NAVServerConfiguration -ServerInstance " + this.Instance + " -KeyName ApiServicesPort -KeyValue " + this.APIPort + ";\n"
      } else {
        Script3 += "Set-NAVServerConfiguration -ServerInstance " + this.Instance + " -KeyName ApiServicesEnabled -KeyValue false;\n"
      }
      
      var Script4 = "Write-Host 'Restarting Service...';\nRestart-NAVServerInstance -ServerInstance " + this.Instance

      this.GeneratedScript = Script1 + Script2 + Script3 + Script4

      var BATPrefix = 'powershell -Command "& {'
      var BATSuffix = '} set /p=All Done.;pause'
      this.GeneratedBATScript = BATPrefix + Script1 + Script2 + Script3 + Script4 + BATSuffix
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