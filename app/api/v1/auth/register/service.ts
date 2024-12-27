import { db } from "@/db/db";
import { PostModels } from "./models";
import { accountsTable, credentialsTable, profilesTable } from "@/db/schema";
import { ulid } from "ulid";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { transporter } from "@/lib/nodemailer";

namespace PostService {
  export class Register {
    constructor(
      private props: {
        client: {
          body: PostModels.Body,
        },
      },
    ) {
      this.props.client.body = PostModels.bodyValidator.parse(this.props.client.body);
    }

    async run(): Promise<{ response: object; status: number; }> {
      const accountId = ulid();

      // TODO: Move it to a separate database repository.
      const results = (await db.batch([
        db
          .insert(accountsTable)
          .values({
            id: accountId,
            provider: "CREDENTIALS",
          })
          .returning({
            contactEmail: accountsTable.email,
            verifiedAt: accountsTable.verifiedAt,
            updatedAt: accountsTable.updatedAt,
          }),
        db
          .insert(credentialsTable)
          .values({
            id: ulid(),
            accountId,
            email: this.props.client.body.email,
            password: await hash(
              this.props.client.body.password + (process.env.BCRYPTJS_SECRECT ?? "secret"),
              Number(process.env.BCRYPTJS_SALT) ?? 12),
          })
          .returning({
            email: credentialsTable.email,
          }),
        db
          .insert(profilesTable)
          .values({
            id: ulid(),
            accountId,
            username: this.props.client.body.username,
          })
          .returning({
            profileId: profilesTable.id,
            username: profilesTable.username,
            bio: profilesTable.bio,
          }),
      ])).flat().reduce((acc, result) => ({ ...acc, ...result }));

      // TODO: Move those token sign logics to a separated utility function.
      const token = sign({
        accountId,
        email: this.props.client.body.email,
        password: this.props.client.body.password,
      }, process.env.JWT_SECRET ?? "secret");
      const verifyToken = sign({ accountId }, process.env.JWT_SECRET ?? "secret");

      // TODO: Move this logic to a utility function as well.
      transporter.sendMail({
        to: this.props.client.body.email,
        subject: "Threadr | Verify your account",
        text: `Activation token: ${verifyToken}`,
      });

      return {
        response: { ...results, token },
        status: 200,
      };
    }
  }
}

export { PostService };
