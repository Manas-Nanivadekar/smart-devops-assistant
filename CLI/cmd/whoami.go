package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

// whoamiCmd represents the whoami command
var whoamiCmd = &cobra.Command{
	Use:   "whoami",
	Short: "A brief description of your command",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("whoami called")
		userDetails()
	},
}

func userDetails() {

	fmt.Println("User details:")
	fmt.Println("Name: Amaan Khan")
	fmt.Println("Email:")
	fmt.Println("Username: Amaan-Khan14")

}
