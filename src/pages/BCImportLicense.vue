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
              label="Instance"
              placeholder="BC230"
              required
              solo
              v-on:change="onChange($event)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="Licensepath"
              type="text"
              label="License File Path"
              placeholder="E:\Download\license.bclicense"
              required
              v-on:change="onChange($event)" solo
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
        Version:230,
        Instance:"BC230",
        Licensepath:"E:\\Download\\license.bclicense",
        GeneratedScript: "",
        GeneratedBATScript:""
      };
    },
    methods:
    {
      generateScriptImportLicense() {
       
       var Script1 = "Import-Module 'C:\\Program Files\\Microsoft Dynamics 365 Business Central\\" + this.Version + "\\Service\\NavAdminTool.ps1'|Out-Null;\n"
       var Script2 = 'Import-NAVServerLicense '+ this.Instance +' -LicenseFile "'+this.Licensepath.replaceAll('"','')+'";\n'
       var Script5 = "Write-Host 'Restarting Service...';\nRestart-NAVServerInstance -ServerInstance " + this.Instance
      
      this.GeneratedScript = Script1 + Script2 +Script5
      
      var BATPrefix = 'powershell -Command "& {'
      var BATSuffix = '} set /p=All Done.;pause'
      this.GeneratedBATScript = BATPrefix+ Script1 + Script2 +Script5 + BATSuffix
    },
    onChange() {
      this.generateScriptImportLicense()
      
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
      Version() {
        this.Instance = "BC" + this.Version
        this.generateScriptImportLicense()
      }
    },
    mounted() {
      this.generateScriptImportLicense()
    }
    
  }
    </script>