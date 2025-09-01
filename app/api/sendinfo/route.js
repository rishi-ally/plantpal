import { NextResponse } from "next/server";
import FormData, { from } from "form-data";
import axios from "axios";

export const config = {
  api: { bodyParser: false },
};

export async function POST(req) {
  try {
    const formdata = await req.formData();
    const file = formdata.get("plant");
    if (!file) {
      return NextResponse.json({ error: "no file uploaded" }, { status: 404 });
    }
    const buffer=Buffer.from(await file.arrayBuffer())

    const newform = new FormData();
       newform.append("images", buffer, {
      filename: file.name,
      contentType: file.type,
    });

   
    newform.append("organs", "leaf");

    const result = await axios.post(
      `https://my-api.plantnet.org/v2/identify/all?api-key=2b10jAS7yJAvkG8MaDDGnKjcce`,
      newform,
      { headers: newform.getHeaders() }
    );

    console.log("PlantNet result:", result.data);
    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "API call failed",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
