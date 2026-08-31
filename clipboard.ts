// System clipboard write via platform subprocess, run from Deno.
// clip.exe (Windows), pbcopy (macOS), wl-copy (Wayland/Linux).

export async function copyToClipboard(text: string): Promise<void> {
  const command =
    Deno.build.os === "windows"
      ? new Deno.Command("clip", { stdin: "piped" })
      : Deno.build.os === "darwin"
      ? new Deno.Command("pbcopy", { stdin: "piped" })
      : new Deno.Command("wl-copy", { stdin: "piped" });

  const child = command.spawn();

  const writer = child.stdin.getWriter();
  await writer.write(new TextEncoder().encode(text));
  await writer.close();

  await child.status;
}
