package cmd

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
	"gopkg.in/yaml.v3"
)

// initCmd represents the init command
var initCmd = &cobra.Command{
	Use:   "init",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("init called")
		majsInit()
	},
}

func init() {
	rootCmd.AddCommand(initCmd)
}

func majsInit() {
	cwd, err := os.Getwd()
	if err != nil {
		fmt.Println("Error getting current working directory:", err)
		return
	}

	fileName := "majs.yml"

	filePath := filepath.Join(cwd, fileName)

	if _, err := os.Stat(filePath); err == nil {
		fmt.Printf("File '%s' already exists in the root directory.\n", fileName)
		return
	}

	file, err := os.Create(filePath)
	if err != nil {
		fmt.Println("Error creating file:", err)
		return
	}
	defer file.Close()

	content := Config{
		Provider: Provider{
			Name: "aws || gcp || azure",
		},
		Datbase: Datbase{
			Name:   "rds || cloudsql || cosmosdb",
			Kind:   "sql",
			Family: "t2.micro",
		},
	}

	yamlContent, err := yaml.Marshal(content)
	if err != nil {
		fmt.Println("Error marshaling content to YAML:", err)
		return
	}

	_, err = file.WriteString(string(yamlContent))
	if err != nil {
		fmt.Println("Error writing to file:", err)
		return
	}

	fmt.Printf("File '%s' created successfully in the root directory.\n", fileName)

}

type Config struct {
	Provider Provider `yaml:"provider"`
	Datbase  Datbase  `yaml:"database"`
}

type Provider struct {
	Name string `yaml:"name"`
}

type Datbase struct {
	Name   string `yaml:"name"`
	Kind   string `yaml:"type"`
	Family string `yaml:"family"`
}
