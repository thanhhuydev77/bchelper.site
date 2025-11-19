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
                    :items="typeOptions"
                    label="Type"
                    outlined
                    dense
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="containerVersion"
                    :items="versionOptions"
                    label="Version"
                    outlined
                    dense
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="containerName"
                    label="Container Name (optional)"
                    placeholder="e.g., mybc"
                    outlined
                    dense
                    hint="If not specified, a default name will be used"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-btn
                    @click="toggleGenerateCommand"
                    color="primary"
                    class="mr-2"
                  >
                    Generate Command
                  </v-btn>
                  <v-btn
                    color="secondary"
                    @click="copyCommand"
                    :disabled="!generatedCommand"
                  >
                    Copy Command
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>

            <v-divider class="my-4" v-if="generatedCommand && showCommand"></v-divider>

            <div v-if="generatedCommand && showCommand">
              <h3 class="mb-2">Generated PowerShell Command:</h3>
              <v-card class="bg-grey-lighten-3 pa-4" color="surface">
                <code class="text-caption">{{ generatedCommand }}</code>
              </v-card>
              <v-alert type="info" class="mt-4">
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
  data() {
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
  methods: {
    toggleGenerateCommand() {
      if (!this.generatedCommand) {
        this.generateCommand();
      }
      this.showCommand = !this.showCommand;
    },
    generateCommand() {
      const containerType = this.containerType.toLowerCase();
      const country = 'us'; // Default country
      const version = this.containerVersion === 'latest' ? 'Latest' : this.containerVersion;
      
      const name = this.containerName || `mybc${this.containerType.toLowerCase()}`;
      
      let command = '';
      
      if (this.containerVersion === 'latest') {
        command = `$artifactUrl = Get-BcArtifactUrl -type ${containerType} -country ${country} -select Latest\nNew-BCContainer -accept_eula -containerName ${name} -artifactUrl $artifactUrl`;
      } else {
        // For specific versions
        command = `$artifactUrl = Get-BcArtifactUrl -type ${containerType} -country ${country} -select ${version}\nNew-BCContainer -accept_eula -containerName ${name} -artifactUrl $artifactUrl`;
      }
      
      this.generatedCommand = command;
    },
    copyCommand() {
      if (this.generatedCommand) {
        navigator.clipboard.writeText(this.generatedCommand).then(() => {
          this.$notify({
            group: 'foo',
            title: 'Success',
            text: 'Command copied to clipboard!',
            type: 'success',
          });
        }).catch(() => {
          this.$notify({
            group: 'foo',
            title: 'Error',
            text: 'Failed to copy command',
            type: 'error',
          });
        });
      }
    },
  },
  watch: {
    containerType() {
      this.generateCommand()
    },
    containerVersion() {
      this.generateCommand()
    },
    containerName() {
      this.generateCommand()
    }
  },
  mounted() {
    this.generateCommand()
  }
}
</script>

<style scoped>
code {
  word-break: break-all;
  white-space: pre-wrap;
}
</style>
