package cmd

import (
	"fmt"
	"os"
	"os/exec"
	"time"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "majs",
	Short: "Cloud CLI Installer",
	Long:  `This CLI tool allows you to install, or remove various cloud CLIs.`,

	Run: func(cmd *cobra.Command, args []string) {
		about()
	},
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		if cmd.Name() == "configure" || cmd.Name() == "majs" {
			return
		}
		if !isAuthenticatedUser() {
			fmt.Println("You need to be authenticated to use this tool. Run 'majs configure' to authenticate.")
			os.Exit(1)
		}
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func init() {
	rootCmd.AddCommand(majsConfigCmd)
	rootCmd.AddCommand(whoamiCmd)
}

func about() {
	time.Sleep(1 * time.Second)

	fmt.Println("majs <command>")
	cmd := exec.Command("majs", "--help")
	cmd.Stdout = os.Stdout
	if err := cmd.Run(); err != nil {
		fmt.Println("Error", err)
		os.Exit(1)
	}

}
