import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>Manage&nbsp;</span>
          <span className={title({ color: "violet" })}>cafés&nbsp;</span>
          <br />
          <span className={title()}>with this simple app.</span>
        </div>

        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <div className="flex flex-col items-center text-center">
              <span>
                Get started by navigating to the&nbsp;
                <br />
                <Link href="/cafes">
                  <Code color="primary">cafés page</Code>
                </Link>
                &nbsp;or the&nbsp;
                <Link href="/employees">
                  <Code color="primary">employees page</Code>
                </Link>
                .
              </span>
            </div>
          </Snippet>
        </div>
      </section>
    </DefaultLayout>
  );
}
