import firebase from "firebase";
const firestore = firebase.firestore;

type ValidStringOrFieldPath = string | firebase.firestore.FieldPath;
function isStringOrFieldPath(obj: any): obj is ValidStringOrFieldPath {
  return typeof obj === "string" || obj instanceof firestore.FieldPath;
}

export type SearchWhere = [
  ValidStringOrFieldPath,
  firebase.firestore.WhereFilterOp,
  any
];
function isValidWhere(obj: any): obj is SearchWhere {
  return (
    Array.isArray(obj) &&
    obj.length === 3 &&
    isStringOrFieldPath(obj[0]) &&
    typeof obj[1] === "string"
  );
}

export type SearchOptions = {
  where?: SearchWhere[] | SearchWhere;
};

export function JoinWhere(
  ...wheres: (SearchWhere[] | SearchWhere | undefined)[]
): SearchWhere[] {
  const result = [] as SearchWhere[];

  for (const where of wheres) {
    if (isValidWhere(where)) result.push(where);
    else if (Array.isArray(where)) result.push(...where);
  }

  return result;
}

export function ConstructFilter(options?: SearchOptions) {
  if (options) return options;
  return {} as SearchOptions;
}

export function DefineDocumentModel<T = firebase.firestore.DocumentData>(
  collectionName: string
) {
  return class DocumentModel {
    static CollectionName = collectionName;

    static get Collection() {
      return firestore().collection(
        this.CollectionName
      ) as firebase.firestore.CollectionReference<T>;
    }

    static get(id: string) {
      return this.Collection.doc(id).get();
    }

    static list(options?: SearchOptions) {
      const search = ConstructFilter(options);

      //* Query
      let query:
        | firebase.firestore.CollectionReference<T>
        | firebase.firestore.Query<T> = this.Collection;
      //* Filters
      if (search.where) {
        for (const where of JoinWhere(search.where)) {
          query = query.where(...((where as unknown) as SearchWhere));
        }
      }

      return query.orderBy("lastModification", "desc").get();
    }

    static push(data: T) {
      const filtered = ({} as unknown) as T;
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          if (data[key]) filtered[key] = data[key];
        }
      }
      return this.Collection.add(filtered);
    }

    static put(id: string, data: Partial<T>) {
      const filtered = ({} as unknown) as Partial<T>;
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          if (data[key]) filtered[key] = data[key];
        }
      }
      return this.Collection.doc(id).update(filtered);
    }

    static remove(id: string) {
      return this.Collection.doc(id).delete();
    }
  };
}

export interface SucursalData {
  nombre: string;
  ganancias: number;
  empleados: number;
  lastModification: firebase.firestore.Timestamp;
}
export type SucursalView = SucursalData & { id: string };
export const SucursalModel = DefineDocumentModel<SucursalData>("sucursal");
