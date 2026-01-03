<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="12">
        <h1 class="mb-4">Create Docker BC</h1>
        <v-card>
          <v-card-text>
            <v-form>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="containerType"
                    dense
                    :items="typeOptions"
                    label="Type"
                    outlined
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="containerVersion"
                    dense
                    :items="versionOptions"
                    label="Version"
                    outlined
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="containerName"
                    dense
                    hint="If not specified, a default name will be used"
                    label="Container Name (optional)"
                    outlined
                    placeholder="e.g., mybc"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-btn
                    class="mr-2"
                    color="primary"
                    @click="toggleGenerateCommand"
                  >
                    Generate Command
                  </v-btn>
                  <v-btn
                    color="secondary"
                    :disabled="!generatedCommand"
                    @click="copyCommand"
                  >
                    Copy Command
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>

            <v-divider v-if="generatedCommand && showCommand" class="my-4" />

            <div v-if="generatedCommand && showCommand">
              <h3 class="mb-2">Generated PowerShell Command:</h3>
              <v-card class="bg-grey-lighten-3 pa-4" color="surface">
                <code class="text-caption">{{ generatedCommand }}</code>
              </v-card>
              <v-alert class="mt-4" type="info">
                <strong>Instructions:</strong>
                <ol>
                  <li>Open PowerShell as Administrator</li>
                  <li>First, install BCContainerHelper: <code>install-module BCContainerHelper -force</code></li>
                  <li>Copy and paste the generated command above</li>
                  <li>Wait for the container to be created and initialized</li>
                </ol>
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
    name: 'BCCreateDocker',
    data () {
      return {
        containerType: 'Sandbox',
        containerVersion: 'latest',
        containerName: '',
        showCommand: false,
        typeOptions: [
          { title: 'Sandbox', value: 'Sandbox' },
          { title: 'OnPrem', value: 'OnPrem' },
        ],
        versionOptions: [
          { title: 'Latest', value: 'Latest' },
          { title: '27.0', value: '270' },
          { title: '26.0', value: '260' },
          { title: '25.0', value: '250' },
          { title: '24.0', value: '240' },
        ],
        generatedCommand: '',
      }
    },
    watch: {
      containerType () {
        this.generateCommand()
      },
      containerVersion () {
        this.generateCommand()
      },
      containerName () {
        this.generateCommand()
      },
    },
    mounted () {
      this.generateCommand()
    },
    methods: {
      toggleGenerateCommand () {
        if (!this.generatedCommand) {
          this.generateCommand()
        }
        this.showCommand = !this.showCommand
      },
      generateCommand () {
        const containerType = this.containerType.toLowerCase()
        const country = 'us' // Default country
        const version = this.containerVersion === 'latest' ? 'Latest' : this.containerVersion

        const name = this.containerName || `mybc${this.containerType.toLowerCase()}`

        let command = ''

        if (this.containerVersion === 'latest') {
          command = `$artifactUrl = Get-BcArtifactUrl -type ${containerType} -country ${country} -select Latest\nNew-BCContainer -accept_eula -containerName ${name} -artifactUrl $artifactUrl`
        } else {
          // For specific versions
          command = `$artifactUrl = Get-BcArtifactUrl -type ${containerType} -country ${country} -select ${version}\nNew-BCContainer -accept_eula -containerName ${name} -artifactUrl $artifactUrl`
        }

        this.generatedCommand = command
      },
      copyCommand () {
        if (this.generatedCommand) {
          navigator.clipboard.writeText(this.generatedCommand).then(() => {
            this.$notify({
              group: 'foo',
              title: 'Success',
              text: 'Command copied to clipboard!',
              type: 'success',
            })
          }).catch(() => {
            this.$notify({
              group: 'foo',
              title: 'Error',
              text: 'Failed to copy command',
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
