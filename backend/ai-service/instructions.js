const REGISTRY_URL = "http://localhost:3000";

export async function getInstruction(id) {
  const res = await fetch(`${REGISTRY_URL}/instructions/${id}`);

  if (!res.ok) {
    throw new Error(`Instruction ${id} not found`);
  }

  return res.json();
}