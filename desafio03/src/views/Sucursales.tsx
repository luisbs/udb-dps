import React, { FormEvent, Component } from "react";

import {
  SucursalData,
  SucursalModel,
  SucursalView,
} from "../plugins/firestore";
import firebase from "../plugins/firebase";
import Toast from "../plugins/Toastr";

export default class Sucursal extends Component<
  {},
  {
    sucursales: SucursalView[];
    fields: {
      id: string;
      nombre: string;
      empleados: number;
      ganancias: number;
    };
    errors: {
      nombre?: string;
      empleados?: string;
      ganancias?: string;
    };
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      sucursales: [],
      fields: {
        id: "",
        nombre: "",
        empleados: 10,
        ganancias: 1000,
      },
      errors: {},
    };

    this.setForm = this.setForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.descargarSucursales = this.descargarSucursales.bind(this);
  }

  //* Form
  setForm(sucursalId?: string) {
    const sucursal = this.state.sucursales.find((s) => s.id === sucursalId);
    this.setState({
      fields: {
        id: sucursal?.id ?? "",
        nombre: sucursal?.nombre ?? "",
        empleados: sucursal?.empleados ?? 10,
        ganancias: sucursal?.ganancias ?? 1000,
      },
    });
  }

  handleChange(field: string, cast: boolean, e: { target: { value: any } }) {
    let fields = this.state.fields;
    // @ts-expect-error
    if (cast) fields[field] = parseInt(e.target.value) ?? 0;
    // @ts-expect-error
    else fields[field] = e.target.value;
    this.setState({ fields });
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors: Record<string, string> = {};
    let formIsValid = true;

    // Nombre
    if (!fields["nombre"]) {
      formIsValid = false;
      errors["nombre"] = "No puede ser vacio";
    } else if (typeof fields["nombre"] !== "undefined") {
      if (!fields["nombre"].match(/^[a-zA-Z]+[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["nombre"] = "Solo letras y espacios";
      }
    }

    // Empleados
    if (!fields["empleados"]) {
      formIsValid = false;
      errors["empleados"] = "No puede ser vacio";
    } else if (fields["empleados"] < 10 || fields["empleados"] > 20) {
      formIsValid = false;
      errors["empleados"] = "Deben estar entre 10 y 20";
    }

    // Ganancias
    if (!fields["ganancias"]) {
      formIsValid = false;
      errors["ganancias"] = "No puede ser vacio";
    } else if (fields["ganancias"] < 1000 || fields["ganancias"] > 50000) {
      formIsValid = false;
      errors["ganancias"] = "Deben estar entre $1,000 y $50,000";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!this.handleValidation()) Toast.show("Hay campos invalidos", "error");
    else {
      Toast.show("Enviado", "info");

      this.guardarSucursal({
        ...this.state.fields,
        lastModification: firebase.firestore.Timestamp.now(),
      });
      this.modal?.hide();
      this.setForm();
    }
  }

  render() {
    const { sucursales } = this.state;

    return (
      <>
        <div
          className="modal fade"
          id="sucursalModal"
          tabIndex={-1}
          aria-labelledby="sucursalModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="sucursalModalLabel">
                  <span>
                    {!this.state.fields["id"]
                      ? "Añadiendo sucursal"
                      : `Modificando sucursal (${this.state.fields["id"]})`}
                  </span>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form className="row my-4" onSubmit={this.onSubmit}>
                  <div className="col-12 col-sm-6 mb-3">
                    <label className="form-label">Nombre de la Sucursal</label>
                    <input
                      className="form-control"
                      type="text"
                      value={this.state.fields["nombre"]}
                      onChange={this.handleChange.bind(this, "nombre", false)}
                    />
                    <small className="text-danger">
                      {this.state.errors["nombre"]}
                    </small>
                  </div>
                  <div className="col-12 col-sm-6 mb-3">
                    <label className="form-label">
                      Empleados de la Sucursal
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      value={this.state.fields["empleados"]}
                      onChange={this.handleChange.bind(this, "empleados", true)}
                      step={1}
                      min={10}
                      max={20}
                    />
                    <small className="text-danger">
                      {this.state.errors["empleados"]}
                    </small>
                  </div>
                  <div className="col-12 col-sm-6 mb-3">
                    <label className="form-label">
                      Ganancias de la Sucursal
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      value={this.state.fields["ganancias"]}
                      onChange={this.handleChange.bind(this, "ganancias", true)}
                      step={100}
                      min={1000}
                      max={50000}
                    />
                    <small className="text-danger">
                      {this.state.errors["ganancias"]}
                    </small>
                  </div>
                  <div className="col-12 col-sm-6 d-flex flex-column">
                    <button className="col btn btn-primary" type="submit">
                      Enviar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row my-3">
          {sucursales.map((sucursal, i) => (
            <div className="col-12 col-md-6 col-lg-4 mb-3" key={i}>
              <div className="card">
                <h4 className="card-header">
                  <small className="text-muted mr-2">{sucursal.id}</small>
                  {sucursal.nombre}
                </h4>
                <div className="card-body">
                  <p className="card-text">
                    Esta sucursal cuenta con {sucursal.empleados} empleados y $
                    {sucursal.ganancias} en ganancias
                  </p>
                </div>
                <div className="card-body d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-toggle="modal"
                    data-target="#sucursalModal"
                    onClick={() => this.setForm(sucursal.id)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger ml-3"
                    onClick={() => this.eliminarSucursal(sucursal.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card text-center bg-light">
              <button
                className="border-0"
                type="button"
                data-toggle="modal"
                data-target="#sucursalModal"
                onClick={() => this.setForm()}
              >
                <div className="card-img-top">
                  <img
                    className="m-5"
                    width="100px"
                    src="https://www.flaticon.com/svg/static/icons/svg/992/992651.svg"
                    alt="añadir sucursal"
                  />
                </div>
                <h4 className="card-body text-muted">Añadir Sucursal</h4>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  private modal: null | { hide: () => void } = null;

  componentDidMount() {
    this.descargarSucursales();
    // @ts-expect-error
    this.modal = new bootstrap.Modal(
      document.getElementById("sucursalModal"),
      {}
    );
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

  eliminarSucursal(sucursalId: string) {
    SucursalModel.remove(sucursalId)
      .then(() => {
        Toast.show("Removido");
        this.descargarSucursales();
      })
      .catch(Toast.error);
  }

  guardarSucursal(sucursal: SucursalData & { id?: string }) {
    if (sucursal.id) {
      const { id, ...data } = sucursal;
      SucursalModel.put(id, data)
        .then(() => {
          Toast.show("Modificado");
          this.descargarSucursales();
        })
        .catch(Toast.error);
    } else {
      SucursalModel.push(sucursal)
        .then(() => {
          Toast.show("Agregado");
          this.descargarSucursales();
        })
        .catch(Toast.error);
    }
  }
}
