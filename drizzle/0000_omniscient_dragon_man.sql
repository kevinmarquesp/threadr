CREATE TABLE `Accounts` (
	`id` text(26) NOT NULL,
	`email` text,
	`provider` text NOT NULL,
	`verifiedAt` integer,
	`deletedAt` integer,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Accounts_id_unique` ON `Accounts` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `Accounts_email_unique` ON `Accounts` (`email`);--> statement-breakpoint
CREATE TABLE `Credentials` (
	`id` text(26) NOT NULL,
	`accountId` text(26) NOT NULL,
	`email` text NOT NULL,
	`password` text(60) NOT NULL,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`accountId`) REFERENCES `Accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Credentials_id_unique` ON `Credentials` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `Credentials_accountId_unique` ON `Credentials` (`accountId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Credentials_email_unique` ON `Credentials` (`email`);--> statement-breakpoint
CREATE TABLE `Profiles` (
	`id` text(26) NOT NULL,
	`accountId` text(26) NOT NULL,
	`username` text NOT NULL,
	`bio` text,
	`deletedAt` integer,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`accountId`) REFERENCES `Accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Profiles_id_unique` ON `Profiles` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `Profiles_accountId_unique` ON `Profiles` (`accountId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Profiles_username_unique` ON `Profiles` (`username`);