import Invitation from "@/components/Invitation";
import { getEffectiveSettings } from "@/lib/wedding-settings";

export const dynamic = "force-dynamic";

export default async function Page() {
  const settings = await getEffectiveSettings();
  return <Invitation settings={settings} />;
}
