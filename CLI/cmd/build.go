package cmd

import (
	"archive/zip"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/spf13/cobra"
)

var build = &cobra.Command{
	Use:   "build [directory]",
	Short: "Create a .zip file of the directory contents and upload to S3",
	Long:  `This command creates a .zip file of the contents in the specified directory and uploads it to S3.`,
	Args:  cobra.ExactArgs(1),
	Run:   runBuild,
}

func runBuild(cmd *cobra.Command, args []string) {
	dir := args[0]
	zipFileName := "codebase.zip"
	zipFilePath := filepath.Join(dir, zipFileName)
	time.Sleep(2 * time.Second)
	fmt.Println("Creating zip file...")
	if err := zipDir(dir, zipFilePath); err != nil {
		fmt.Printf("Error creating zip file: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("Successfully created %s\n", zipFileName)

	fmt.Println("Uploading to S3...")
	if err := uploadToS3(zipFilePath); err != nil {
		fmt.Printf("Error uploading to S3: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("Successfully uploaded %s to S3\n", zipFileName)

	fmt.Println("Build process completed successfully.")
}

func zipDir(source, target string) error {
	fmt.Println("Starting zip process...")
	zipfile, err := os.Create(target)
	if err != nil {
		return fmt.Errorf("failed to create zip file: %w", err)
	}
	defer zipfile.Close()

	archive := zip.NewWriter(zipfile)
	defer archive.Close()

	return filepath.Walk(source, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			fmt.Printf("Error accessing path %s: %v\n", path, err)
			return err
		}

		if path == target || strings.Contains(path, "node_modules") || strings.Contains(path, "README.md") {
			return nil
		}

		relPath, err := filepath.Rel(source, path)
		if err != nil {
			return fmt.Errorf("failed to get relative path: %w", err)
		}

		// Skip root directory
		if relPath == "." {
			return nil
		}

		header, err := zip.FileInfoHeader(info)
		if err != nil {
			return fmt.Errorf("failed to create zip header: %w", err)
		}

		header.Name = relPath
		if info.IsDir() {
			header.Name += "/"
		} else {
			header.Method = zip.Deflate
		}

		writer, err := archive.CreateHeader(header)
		if err != nil {
			return fmt.Errorf("failed to create zip entry: %w", err)
		}

		if info.IsDir() {
			return nil
		}

		file, err := os.Open(path)
		if err != nil {
			return fmt.Errorf("failed to open file: %w", err)
		}
		defer file.Close()

		_, err = io.Copy(writer, file)
		return err
	})
}

func uploadToS3(filePath string) error {
	fmt.Println("Starting S3 upload process...")
	file, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("ap-south-1"),
	})
	if err != nil {
		return fmt.Errorf("failed to create AWS session: %w", err)
	}

	uploader := s3manager.NewUploader(sess)
	_, err = uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String("majs-storage-engine"),
		Key:    aws.String(filepath.Base(filePath)),
		Body:   file,
	})
	if err != nil {
		return fmt.Errorf("failed to upload file: %w", err)
	}

	fmt.Println("S3 upload completed.")
	return nil
}

func init() {
	rootCmd.AddCommand(build)
}
