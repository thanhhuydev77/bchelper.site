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
            :items="['Windows', 'NavUserPassword']"
            v-on:change="onChange($event)"
            v-on:blur="onChange($event)"
            solo
          ></v-combobox>
        </v-col>
      </v-row>
      <v-row v-if="AuthType === 'NavUserPassword'">
        <v-col cols="12">
          <v-card class="pa-4" variant="outlined">
            <v-card-title class="text-h6">NAV User Info</v-card-title>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="Username"
                  type="text"
                  label="Username"
                  placeholder="admin"
                  required
                  solo
                  v-on:change="onChange($event)"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="Password"
                  type="password"
                  label="Password"
                  placeholder="Abc@12345"
                  v-on:change="onChange($event)"
                  solo
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="AuthType === 'Windows'">
        <v-col cols="12">
          <v-card class="pa-4" variant="outlined">
            <v-card-title class="text-h6">Windows User Info</v-card-title>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="WindowsAccount"
                  type="text"
                  label="Windows Account (Domain\\Username)"
                  placeholder="huyht7"
                  v-on:change="onChange($event)"
                  solo
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-combobox
            v-model="PermissionSet"
            label="Permission Set"
            :items="['SUPER', 'BASIC', 'DEVELOPER', 'FULL', 'READ', 'SECURITY']"
            v-on:change="onChange($event)"
            v-on:blur="onChange($event)"
            solo
          ></v-combobox>
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
      AuthType: "NavUserPassword",
      Username: "admin",
      Password: "",
      PermissionSet: "SUPER",
      WindowsAccount: "huyht7",
      GeneratedScript: "",
      GeneratedBATScript: ""
    }
  },
  methods: {
    generateScript() {
      var Script1 = "Import-Module 'C:\\Program Files\\Microsoft Dynamics 365 Business Central\\" + this.Version + "\\Service\\NavAdminTool.ps1'|Out-Null;\n"
      
      var Script2 = ""
      if (this.AuthType === "NavUserPassword") {
        Script2 += "$user = \"" + this.Username + "\"\n"
        Script2 += "$password = ConvertTo-SecureString \"" + this.Password + "\" -AsPlainText -Force\n"
        Script2 += "New-NAVServerUser -ServerInstance " + this.Instance + " -UserName $user -Password $password\n"
        Script2 += "New-NAVServerUserPermissionSet -ServerInstance " + this.Instance + " -PermissionSetId \"" + this.PermissionSet + "\" -UserName $user\n"
      } else if (this.AuthType === "Windows") {
        Script2 += "New-NAVServerUser -ServerInstance " + this.Instance + " -WindowsAccount " + this.WindowsAccount + "\n"
        Script2 += "New-NAVServerUserPermissionSet -PermissionSetId " + this.PermissionSet + " -ServerInstance " + this.Instance + " -WindowsAccount " + this.WindowsAccount + "\n"
      }
      
      var Script3 = "Write-Host 'User created successfully!';\n"

      this.GeneratedScript = Script1 + Script2 + Script3

      var BATPrefix = 'powershell -Command "& {'
      var BATSuffix = '} set /p=All Done.;pause'
      this.GeneratedBATScript = BATPrefix + Script1 + Script2 + Script3 + BATSuffix
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
      link.download = "AddNewUser.bat";
      link.click();
      URL.revokeObjectURL(link.href);
    },

  },
  mounted() {
    this.generateScript()
  }

}
</script>