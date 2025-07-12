<template>
  <div class="pa-2">
    <v-container class="ma-0">
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="OperationType"
            label="Operation Type"
            :items="['Backup', 'Restore']"
            solo
            v-on:change="onChange($event)"
            @update:model-value="onChange($event)"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="ServerInstance"
            label="Server Instance"
            placeholder="DESKTOP-7HV1K81\BCDEMO"
            required
            solo
            v-on:change="onChange($event)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="DatabaseName"
            label="Database Name"
            placeholder="BC230"
            required
            solo
            v-on:change="onChange($event)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="BackupFilePath"
            label="Backup File Path"
            placeholder="E:\backup.bak"
            required
            solo
            v-on:change="onChange($event)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card class="pa-4" variant="outlined">
            <v-card-title class="text-h6">Additional Options</v-card-title>
            <v-row>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="InstallSqlServerModule"
                  color="primary"
                  label="Install SqlServer Module"
                  v-on:change="onChange($event)"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="6" v-if="OperationType === 'Backup'">
                <v-switch
                  v-model="IncludeCompression"
                  color="primary"
                  label="Include Compression (Backup only)"
                  v-on:change="onChange($event)"
                ></v-switch>
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
      <i>** With PowerShell, Need to be run by Admin privilege.</i>
    </label>
    <notifications group="foo" />
  </div>
</template>

<script>
import { useClipboardCopy } from '@/composables/useClipboard'

export default {
  data() {
    return {
      ServerInstance: 'DESKTOP-7HV1K81\\BCDEMO',
      DatabaseName: 'BC230',
      BackupFilePath: 'E:\\backup.bak',
      OperationType: 'Backup',
      InstallSqlServerModule: true,
      IncludeCompression: true,
      GeneratedScript: '',
      GeneratedBATScript: '',
    }
  },
  methods: {
    generateScript() {
      let script = ''
      
      // Install SqlServer module if selected
      if (this.InstallSqlServerModule) {
        script += "Install-Module -Name SqlServer -Force -AllowClobber;\n"
      }
      
      // Generate backup or restore command
      if (this.OperationType === 'Backup') {
        script += `Backup-SqlDatabase -ServerInstance '${this.ServerInstance}' -Database '${this.DatabaseName}' -BackupFile '${this.BackupFilePath}'`
        if (this.IncludeCompression) {
          script += ' -CompressionOption On'
        }
        script += ';\n'
      } else {
        script += `Restore-SqlDatabase -ServerInstance '${this.ServerInstance}' -Database '${this.DatabaseName}' -BackupFile '${this.BackupFilePath}';\n`
      }
      
      script += "Write-Host 'Operation completed successfully.';\n"
      
      this.GeneratedScript = script

      const BATPrefix = 'powershell -Command "& {'
      const BATSuffix = '} set /p=All Done.;pause'
      this.GeneratedBATScript = BATPrefix + script + BATSuffix
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
  watch: {
    OperationType() {
      this.generateScript()
    },
  },
  mounted() {
    this.generateScript()
  },
}
</script> 