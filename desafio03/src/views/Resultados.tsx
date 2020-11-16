import React, { Component } from "react";

import { SucursalModel, SucursalView } from "../plugins/firestore";

export default class Sucursal extends Component<
  {},
  { sucursales: SucursalView[] }
> {
  constructor(props: any) {
    super(props);
    this.state = { sucursales: [] };

    this.descargarSucursales = this.descargarSucursales.bind(this);
  }

  componentDidMount() {
    this.descargarSucursales();
  }

  //* Store actions
  descargarSucursales() {
    SucursalModel.list().then((data) =>
      this.setState({
        sucursales: data.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as SucursalView)
        ),
      })
    );
  }

  render() {
    const { sucursales } = this.state;

    let montoMenos = 0;
    let montoMas = 0;
    let total = 0;

    sucursales.forEach((s) => {
      total += s.ganancias;
      if (s.ganancias > 25000) montoMas++;
      if (s.ganancias <= 25000) montoMenos++;
    });

    return (
      <>
        <div className="row">
          <div className="col-12">
            <h3 className="text-center">Resultados</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Empleados</th>
                  <th>Ganancias</th>
                  <th>Resultado</th>
                </tr>
              </thead>
              <tbody>
                {sucursales.map((s) => (
                  <tr>
                    <th>{s.nombre}</th>
                    <td>{s.empleados}</td>
                    <td>{s.ganancias}</td>
                    <td>
                      {s.ganancias < 30000 ? "Buen" : "Excelente"} Trabajo
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul>
              <li>{montoMenos} Sucursales ganan entre $1,000 y $25,000</li>
              <li>{montoMas} Sucursales ganan mas de $25,000</li>
              <li>Ganancia total de la empresa: ${total}</li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}
