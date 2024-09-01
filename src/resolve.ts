export async function resolve(data: any, path: string | null): Promise<any> {
  if (!path) {
    return undefined;
  }
  const segments = path.split(".");

  const first = segments.shift() as string;

  let value = await data[first];

  if (value === undefined) {
    return undefined;
  }

  for (const segment of segments) {
    value = value[segment];
    if (value === undefined) {
      return undefined;
    }
  }
  return value;
}
