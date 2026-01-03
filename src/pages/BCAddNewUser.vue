<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="12">
        <h1 class="mb-4">Add New User</h1>
        <v-card>
          <v-card-text>
            <v-form>
              <!-- Basic Configuration -->
              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="version"
                    dense
                    :items="versionOptions"
                    label="Platform Version"
                    outlined
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="instanceName"
                    dense
                    label="Instance Name"
                    outlined
                    placeholder="e.g., BC230"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="authType"
                    dense
                    :items="authTypeOptions"
                    label="Authentication Type"
                    outlined
                  />
                </v-col>
              </v-row>

              <!-- NAV User Configuration (NavUserPassword) -->
              <v-divider v-if="authType === 'NavUserPassword'" class="my-4" />

              <div v-if="authType === 'NavUserPassword'">
                <h3>NAV User Credentials</h3>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="username"
                      dense
                      label="Username"
                      outlined
                      placeholder="admin"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="password"
                      dense
                      label="Password"
                      outlined
                      placeholder="Abc@12345"
                      type="password"
                    />
                  </v-col>
                </v-row>
              </div>

              <!-- Windows User Configuration (Windows) -->
              <v-divider v-if="authType === 'Windows'" class="my-4" />

              <div v-if="authType === 'Windows'">
                <h3>Windows User Account</h3>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="windowsAccount"
                      dense
                      label="Windows Account (Domain\\Username)"
                      outlined
                      placeholder="DOMAIN\\username"
                    />
                  </v-col>
                </v-row>
              </div>

              <!-- Permission Set -->
              <v-divider class="my-4" />

              <h3>Permissions</h3>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="permissionSet"
                    dense
                    :items="permissionSetOptions"
                    label="Permission Set"
                    outlined
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
                  <li>It will create a new user in the BC instance</li>
                  <li>User will be granted the specified permission set</li>
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
    name: 'BCAddNewUser',
    data () {
      return {
        version: '230',
        instanceName: 'BC230',
        authType: 'NavUserPassword',
        username: 'admin',
        password: '',
        windowsAccount: '',
        permissionSet: 'SUPER',
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
          { title: '280', value: '280' },
        ],
        authTypeOptions: [
          { title: 'Windows', value: 'Windows' },
          { title: 'NavUserPassword', value: 'NavUserPassword' },
        ],
        permissionSetOptions: [
          { title: 'SUPER', value: 'SUPER' },
          { title: 'BASIC', value: 'BASIC' },
          { title: 'DEVELOPER', value: 'DEVELOPER' },
          { title: 'FULL', value: 'FULL' },
          { title: 'READ', value: 'READ' },
          { title: 'SECURITY', value: 'SECURITY' },
        ],
      }
    },
    watch: {
      version (newVal) {
        this.instanceName = `BC${newVal}`
        this.generateScript()
      },
      instanceName () {
        this.generateScript()
      },
      authType () {
        this.generateScript()
      },
      username () {
        this.generateScript()
      },
      password () {
        this.generateScript()
      },
      windowsAccount () {
        this.generateScript()
      },
      permissionSet () {
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
        const versionPath = this.version
        let script = `Import-Module 'C:\\Program Files\\Microsoft Dynamics 365 Business Central\\${versionPath}\\Service\\NavAdminTool.ps1'|Out-Null;\n`

        if (this.authType === 'NavUserPassword') {
          script += `$user = "${this.username}"\n`
          script += `$password = ConvertTo-SecureString "${this.password}" -AsPlainText -Force\n`
          script += `New-NAVServerUser -ServerInstance ${this.instanceName} -UserName $user -Password $password\n`
          script += `New-NAVServerUserPermissionSet -ServerInstance ${this.instanceName} -PermissionSetId "${this.permissionSet}" -UserName $user\n`
        } else if (this.authType === 'Windows') {
          script += `New-NAVServerUser -ServerInstance ${this.instanceName} -WindowsAccount ${this.windowsAccount}\n`
          script += `New-NAVServerUserPermissionSet -PermissionSetId ${this.permissionSet} -ServerInstance ${this.instanceName} -WindowsAccount ${this.windowsAccount}\n`
        }

        script += `Write-Host 'User created successfully!';\n`

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
