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
                    dense
                    :items="operationTypeOptions"
                    label="Operation Type"
                    outlined
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="serverInstance"
                    dense
                    label="Server Instance"
                    outlined
                    placeholder="DESKTOP-7HV1K81\BCDEMO"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="databaseName"
                    dense
                    label="Database Name"
                    outlined
                    placeholder="BC230"
                  />
                </v-col>
              </v-row>

              <!-- Backup/Restore Configuration -->
              <v-divider class="my-4" />

              <h3>{{ operationType }} Configuration</h3>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="backupFilePath"
                    dense
                    label="Backup File Path"
                    outlined
                    :placeholder="operationType === 'Backup' ? 'E:\\backup.bak' : 'E:\\restore.bak'"
                  />
                </v-col>
                <v-col v-if="operationType === 'Backup'" cols="12" sm="6">
                  <v-switch
                    v-model="includeCompression"
                    color="primary"
                    label="Include Compression"
                  />
                </v-col>
              </v-row>

              <!-- Additional Options -->
              <v-divider class="my-4" />

              <h3>Additional Options</h3>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="installSqlServerModule"
                    color="primary"
                    label="Install SqlServer Module"
                  />
                </v-col>
              </v-row>

              <!-- Generate Script -->
              <v-row class="mt-4">
                <v-col cols="12">
                  <v-btn
                    class="mr-2"
                    color="primary"
                    @click="toggleGenerateScript"
                  >
                    Generate Script
                  </v-btn>
                  <v-btn
                    color="secondary"
                    :disabled="!generatedScript"
                    @click="copyScript"
                  >
                    Copy Script
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>

            <v-divider v-if="generatedScript && showScript" class="my-4" />

            <div v-if="generatedScript && showScript">
              <h3 class="mb-2">Generated PowerShell Script:</h3>
              <v-card class="bg-grey-lighten-3 pa-4" color="surface">
                <code class="text-caption">{{ generatedScript }}</code>
              </v-card>
              <v-alert class="mt-4" type="warning">
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
    data () {
      return {
        operationType: 'Backup',
        serverInstance: String.raw`DESKTOP-7HV1K81\BCDEMO`,
        databaseName: 'BC230',
        backupFilePath: String.raw`E:\backup.bak`,
        installSqlServerModule: true,
        includeCompression: true,
        showScript: false,
        generatedScript: '',
        operationTypeOptions: [
          { title: 'Backup', value: 'Backup' },
          { title: 'Restore', value: 'Restore' },
        ],
      }
    },
    watch: {
      operationType () {
        this.generateScript()
      },
      serverInstance () {
        this.generateScript()
      },
      databaseName () {
        this.generateScript()
      },
      backupFilePath () {
        this.generateScript()
      },
      installSqlServerModule () {
        this.generateScript()
      },
      includeCompression () {
        this.generateScript()
      },
    },
    mounted () {
      this.generateScript()
    },
    methods: {
      toggleGenerateScript () {
        if (!this.generatedScript) {
          this.generateScript()
        }
        this.showScript = !this.showScript
      },
      generateScript () {
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
      copyScript () {
        if (this.generatedScript) {
          navigator.clipboard.writeText(this.generatedScript).then(() => {
            this.$notify({
              group: 'foo',
              title: 'Success',
              text: 'Script copied to clipboard!',
              type: 'success',
            })
          }).catch(() => {
            this.$notify({
              group: 'foo',
              title: 'Error',
              text: 'Failed to copy script',
              type: 'error',
            })
          })
        }
      },
    },
  }
</script>

<style scoped>
code {
  word-break: break-all;
  white-space: pre-wrap;
}
</style>
