const API = "http://localhost:8081/api/about";

export const getAbout = async () => {
  const res = await fetch(API);
  return res.json();
};

export const createAbout = async (data: any) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateAbout = async (id: number, data: any) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteAbout = async (id: number) => {
  return fetch(`${API}/${id}`, {
    method: "DELETE",
  });
};