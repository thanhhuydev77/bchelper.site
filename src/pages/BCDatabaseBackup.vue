<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="12">
        <h1 class="mb-4">Database Backup & Restore</h1>
        <v-card>
          <v-card-text>
            <v-form>
              <!-- Basic Configuration -->
              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="operationType"
                    :items="operationTypeOptions"
                    label="Operation Type"
                    outlined
                    dense
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="serverInstance"
                    label="Server Instance"
                    placeholder="DESKTOP-7HV1K81\BCDEMO"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="databaseName"
                    label="Database Name"
                    placeholder="BC230"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Backup/Restore Configuration -->
              <v-divider class="my-4"></v-divider>

              <h3>{{ operationType }} Configuration</h3>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="backupFilePath"
                    label="Backup File Path"
                    :placeholder="operationType === 'Backup' ? 'E:\\backup.bak' : 'E:\\restore.bak'"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col v-if="operationType === 'Backup'" cols="12" sm="6">
                  <v-switch
                    v-model="includeCompression"
                    label="Include Compression"
                    color="primary"
                  ></v-switch>
                </v-col>
              </v-row>

              <!-- Additional Options -->
              <v-divider class="my-4"></v-divider>

              <h3>Additional Options</h3>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="installSqlServerModule"
                    label="Install SqlServer Module"
                    color="primary"
                  ></v-switch>
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
                  <li>{{ operationType === 'Backup' ? 'Backup will create a file at the specified path' : 'Restore will overwrite the database' }}</li>
                  <li>Ensure sufficient disk space is available</li>
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
  name: 'BCDatabaseBackup',
  data() {
    return {
      operationType: 'Backup',
      serverInstance: 'DESKTOP-7HV1K81\\BCDEMO',
      databaseName: 'BC230',
      backupFilePath: 'E:\\backup.bak',
      installSqlServerModule: true,
      includeCompression: true,
      showScript: false,
      generatedScript: '',
      operationTypeOptions: [
        { title: 'Backup', value: 'Backup' },
        { title: 'Restore', value: 'Restore' }
      ]
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
      let script = ''
      
      // Install SqlServer module if selected
      if (this.installSqlServerModule) {
        script += `Install-Module -Name SqlServer -Force -AllowClobber;\n`
      }
      
      // Generate backup or restore command
      if (this.operationType === 'Backup') {
        script += `Backup-SqlDatabase -ServerInstance '${this.serverInstance}' -Database '${this.databaseName}' -BackupFile '${this.backupFilePath}'`
        if (this.includeCompression) {
          script += ' -CompressionOption On'
        }
        script += ';\n'
      } else {
        script += `Restore-SqlDatabase -ServerInstance '${this.serverInstance}' -Database '${this.databaseName}' -BackupFile '${this.backupFilePath}';\n`
      }
      
      script += `Write-Host 'Operation completed successfully.';\n`
      
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
    operationType() {
      this.generateScript()
    },
    serverInstance() {
      this.generateScript()
    },
    databaseName() {
      this.generateScript()
    },
    backupFilePath() {
      this.generateScript()
    },
    installSqlServerModule() {
      this.generateScript()
    },
    includeCompression() {
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