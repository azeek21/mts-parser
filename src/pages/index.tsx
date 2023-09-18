import Image from "next/image";
import { Inter } from "next/font/google";
import { InferGetServerSidePropsType } from "next";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import CONFIG from "@/configs/config";
import { Button, Chip, LinearProgress, Typography } from "@mui/material";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

interface IHome
  extends InferGetServerSidePropsType<typeof getServerSideProps> {}

function giftComparator(v1: any, v2: any) {
  v1 = v1.icons?.length || 0;
  v2 = v2.icons?.length || 0;
  return v1 - v2;
}

const baseColumns: GridColDef[] = [
  {
    field: "title",
    headerName: "Name",
    minWidth: 150,
  },
  {
    field: "desctiption",
    headerName: "Description",
    minWidth: 300,
    valueGetter: (param) => param.value,
    renderCell: (param) => (
      <p
        title={param.value}
        dangerouslySetInnerHTML={{ __html: param.value }}
        className="truncate hover:text-clip"
      ></p>
    ),
  },
  {
    field: "tariffType",
    headerName: "Type",
    minWidth: 100,
  },
  {
    field: "characters",
    headerName: "Includes",
    minWidth: 300,
    renderCell: (param) => {
      return (
        <div className="flex gap-1">
          {!param.value || param.value.length == 0 ? "----" : ""}
          {param.value &&
            param.value.length > 0 &&
            param.value.map((characterItem: any, i: number) => (
              <span
                key={i}
                className="px-1 rounded-full border border-neutral-500"
              >
                {characterItem?.value}
              </span>
            ))}
        </div>
      );
    },
  },
  {
    field: "benifits",
    headerName: "Gifts",
    sortComparator: giftComparator,
    minWidth: 120,
    renderCell: (params) => {
      return (
        <>
          {params.value && params.value.description && (
            <div
              // dangerouslySetInnerHTML={{ __html: params.value.description }}
              className="truncate hover:text-clip flex pl-3 min-w-full"
              title={params.value?.description}
            >
              {params.value?.icons?.map((link: string, i: number) => (
                <img
                  key={i}
                  src={link}
                  style={{
                    marginLeft: "-10px",
                    height: 30,
                    width: 30,
                    objectFit: "cover",
                  }}
                />
              ))}
              {params.value.icons.length == 0 && "--------"}
            </div>
          )}
        </>
      );
    },
  },
  {
    field: "price",
    headerName: "Price",
    minWidth: 250,
    sortComparator: (v1, v2) => parseInt(v1.value) - parseInt(v2.value),
    valueGetter: (param) => `${param?.value?.value}`,
    renderCell: (param) => {
      const withDiscount = param.row.withDiscount;
      const discountPrice = param.row.priceWithDiscount;
      const discountText = param.row.discountDescription;
      return (
        <div>
          <div>
            <span
              className={`${
                withDiscount ? "text-decoration-line: line-through text-xs" : ""
              }`}
            >
              {param.value}
            </span>

            {withDiscount && (
              <span className="text-green-500">{discountPrice}</span>
            )}

            {param?.row?.price?.displayUnit}
          </div>

          {withDiscount && (
            <span
              dangerouslySetInnerHTML={{ __html: discountText }}
              className="text-green-300"
            ></span>
          )}
        </div>
      );
    },
  },
  {
    field: "label",
    headerName: "",
    minWidth: 230,
  },
];

export default function Home({ tariffs }: IHome) {
  const [data, setData] = useState(tariffs);
  const [isLoading, setIsLoading] = useState(false);

  async function parse() {
    setIsLoading(true);
    const fetchJob = await fetch(CONFIG.BASE_URL + "api/parse", {
      method: "POST",
    });
    const req = await fetch(CONFIG.BASE_URL + "api/tariffs");
    const data = await req.json();
    setData(data);
    setIsLoading(false);
  }

  return (
    <>
      <header className="p-4 flex items-center justify-between border-b-2 border-neutral-500">
        <Typography color="red" fontSize={"2rem"}>
          MTS TARIFFS
        </Typography>

        <div className="ml-auto mr-8">
          <a
            className="text-green-600 p-2 border-green-700 border rounded-xl text-lg bg-green-950 flex items-center justify-center"
            href="mailto:pymanuz@gmail.com"
          >
            Mail Me :-)
          </a>
        </div>

        <Button
          variant="outlined"
          size="large"
          disabled={isLoading}
          onClick={parse}
        >
          Parse
        </Button>
      </header>
      {isLoading && <LinearProgress />}

      <main className="mt-4 px-4 max-w-screen-2xl m-auto h-full pb-24">
        {data && data.length == 0 && (
          <h1>
            No data yet. Tring parsing the data first by clicking the PARSAE
            button.
          </h1>
        )}
        {data && data.length > 0 && (
          <DataGrid
            columns={baseColumns}
            rows={data}
            slots={{ toolbar: GridToolbar }}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 15, 20, 25]}
          />
        )}
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const req = await fetch(CONFIG.BASE_URL + "api/tariffs");
  const data = await req.json();
  return {
    props: {
      tariffs: data,
    },
  };
}
