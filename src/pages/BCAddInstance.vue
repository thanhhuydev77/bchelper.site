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
        <v-col cols="12" md="3">
          <v-combobox
            v-model="AuthType"
            label="Authentication Type"
            :items="['Windows', 'NavUserPassword', 'AAD']"
            v-on:change="onChange($event)"
            v-on:blur="onChange($event)"
            solo
          ></v-combobox>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="WebServerInstance"
            type="text"
            label="Web Server Instance"
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
            <v-card-title class="text-h6">New Instance Configuration</v-card-title>
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="ManagementServicesPort"
                  type="number"
                  label="Management Services Port"
                  placeholder="12045"
                  v-on:change="onChange($event)"
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="ClientServicesPort"
                  type="number"
                  label="Client Services Port"
                  placeholder="12046"
                  v-on:change="onChange($event)"
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="SOAPServicesPort"
                  type="number"
                  label="SOAP Services Port"
                  placeholder="12047"
                  v-on:change="onChange($event)"
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="ODataServicesPort"
                  type="number"
                  label="OData Services Port"
                  placeholder="12048"
                  v-on:change="onChange($event)"
                  solo
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="DeveloperServicesPort"
                  type="number"
                  label="Developer Services Port"
                  placeholder="12049"
                  v-on:change="onChange($event)"
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="DatabaseServer"
                  type="text"
                  label="Database Server"
                  placeholder="localhost"
                  v-on:change="onChange($event)"
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="DatabaseName"
                  type="text"
                  label="Database Name"
                  placeholder="BC230"
                  v-on:change="onChange($event)"
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-switch
                  v-model="AddFirewallException"
                  label="Add Firewall Exception"
                  v-on:change="onChange($event)"
                  color="primary"
                ></v-switch>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-textarea
      label="Generated Script"
      v-model="GeneratedScript"
      v-on:beforeMount="onLoad($event)"
    ></v-textarea>
    <v-btn
      color="primary"
      id="CopyClipboardBtn"
      @click="copyToClipboard"
    >Copy</v-btn>
    <v-btn
      color="secondary"
      style="margin-left: 20px;"
      v-on:click="downloadFileAL"
    >Download Batch File</v-btn>
    <br />
    <br />
    <label style="color: red;">
      <i>** With PowerShell, Need to be run by Admin priviledge.</i>
    </label>
    <br />
    <label style="color: red;">
      <i>** With BATCH file, right click and Choose RUN AS ADMINISTRATOR to run.</i>
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
      AuthType: "Windows",
      WebServerInstance: "BC230",
      ManagementServicesPort: 12045,
      ClientServicesPort: 12046,
      SOAPServicesPort: 12047,
      ODataServicesPort: 12048,
      DeveloperServicesPort: 12049,
      DatabaseServer: "localhost",
      DatabaseName: "BC230",
      AddFirewallException: true,
      GeneratedScript: "",
      GeneratedBATScript: ""
    }
  },
  methods: {
    generateScript() {
      var Script1 = "Import-Module 'C:\\Program Files\\Microsoft Dynamics 365 Business Central\\" + this.Version + "\\Service\\NavAdminTool.ps1'|Out-Null;\n"
      
      var Script2 = "Write-Host 'Creating new server instance...';\n"
      Script2 += "New-NAVServerInstance -ManagementServicesPort " + this.ManagementServicesPort + " -ServerInstance " + this.Instance + " -ClientServicesCredentialType " + this.AuthType + " -ClientServicesPort " + this.ClientServicesPort + " -DatabaseName " + this.DatabaseName + " -DatabaseServer " + this.DatabaseServer + " -DeveloperServicesPort " + this.DeveloperServicesPort + " -ODataServicesPort " + this.ODataServicesPort + " -SOAPServicesPort " + this.SOAPServicesPort + ";\n"
      
      var Script3 = "Write-Host 'Starting server instance...';\n"
      Script3 += "Start-NAVServerInstance -ServerInstance " + this.Instance + ";\n"
      
      var Script4 = "Write-Host 'Creating web server instance...';\n"
      var firewallParam = this.AddFirewallException ? " -AddFirewallException" : ""
      Script4 += "New-NAVWebServerInstance -Server " + this.DatabaseServer + " -ServerInstance " + this.Instance + " -WebServerInstance " + this.WebServerInstance + firewallParam + " -ClientServicesCredentialType " + this.AuthType + " -ClientServicesPort " + this.ClientServicesPort + " -ManagementServicesPort " + this.ManagementServicesPort + " -SiteDeploymentType SubSite;\n"
      
      var Script5 = "Write-Host 'New instance created successfully!';\n"

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
    downloadFileAL() {
      const blob = new Blob([this.GeneratedBATScript], { type: "application/txt" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "AddBCInstance.bat";
      link.click();
      URL.revokeObjectURL(link.href);
    },

  },
  mounted() {
    this.generateScript()
  }

}
</script> 