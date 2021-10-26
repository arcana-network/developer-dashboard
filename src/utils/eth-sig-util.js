import ethAbi from "ethereumjs-abi";
import { Buffer } from "buffer";
// import { keccak256 } from "web3-utils";
import * as ethUtil from "ethereumjs-util";
import { keccak256, keccak } from "ethereumjs-util";

const TYPED_MESSAGE_SCHEMA = {
  type: "object",
  properties: {
    types: {
      type: "object",
      additionalProperties: {
        type: "array",
        items: {
          type: "object",
          properties: { name: { type: "string" }, type: { type: "string" } },
          required: ["name", "type"],
        },
      },
    },
    primaryType: { type: "string" },
    domain: { type: "object" },
    message: { type: "object" },
  },
  required: ["types", "primaryType", "domain", "message"],
};

const TypedDataUtils = {
  encodeData(e, t, r, n = !0) {
    const i = ["bytes32"],
      o = [this.hashType(e, r)];
    if (n) {
      const a = (e, t, i) => {
        if (void 0 !== r[t])
          return [
            "bytes32",
            null == i
              ? "0x0000000000000000000000000000000000000000000000000000000000000000"
              : keccak256(this.encodeData(t, i, r, n)),
          ];
        if (void 0 === i)
          throw new Error(`missing value for field ${e} of type ${t}`);
        if ("bytes" === t) return ["bytes32", keccak256(i)];
        if ("string" === t)
          return (
            "string" == typeof i && (i = Buffer.from(i, "utf8")),
            ["bytes32", keccak256(i)]
          );
        if (t.lastIndexOf("]") === t.length - 1) {
          const r = t.slice(0, t.lastIndexOf("[")),
            n = i.map((t) => a(e, r, t));
          return [
            "bytes32",
            keccak256(
              ethAbi.rawEncode(
                n.map(([e]) => e),
                n.map(([, e]) => e)
              )
            ),
          ];
        }
        return [t, i];
      };
      for (const n of r[e]) {
        const [e, r] = a(n.name, n.type, t[n.name]);
        i.push(e), o.push(r);
      }
    } else
      for (const a of r[e]) {
        let e = t[a.name];
        if (void 0 !== e)
          if ("bytes" === a.type)
            i.push("bytes32"), (e = keccak256(e)), o.push(e);
          else if ("string" === a.type)
            i.push("bytes32"),
              "string" == typeof e && (e = Buffer.from(e, "utf8")),
              (e = keccak256(e)),
              o.push(e);
          else if (void 0 !== r[a.type])
            i.push("bytes32"),
              (e = keccak256(this.encodeData(a.type, e, r, n))),
              o.push(e);
          else {
            if (a.type.lastIndexOf("]") === a.type.length - 1)
              throw new Error(
                "Arrays are unimplemented in encodeData; use V4 extension"
              );
            i.push(a.type), o.push(e);
          }
      }
    return ethAbi.rawEncode(i, o);
  },
  encodeType(e, t) {
    let r = "",
      n = this.findTypeDependencies(e, t).filter((t) => t !== e);
    n = [e].concat(n.sort());
    for (const e of n) {
      if (!t[e]) throw new Error("No type definition specified: " + e);
      r += `${e}(${t[e].map(({ name: e, type: t }) => `${t} ${e}`).join(",")})`;
    }
    return r;
  },
  findTypeDependencies(e, t, r = []) {
    if ((([e] = e.match(/^\w*/u)), r.includes(e) || void 0 === t[e])) return r;
    r.push(e);
    for (const n of t[e])
      for (const e of this.findTypeDependencies(n.type, t, r))
        !r.includes(e) && r.push(e);
    return r;
  },
  hashStruct(e, t, r, n = !0) {
    return keccak256(this.encodeData(e, t, r, n));
  },
  hashType(e, t) {
    return keccak256(this.encodeType(e, t));
  },
  sanitizeData(e) {
    const t = {};
    for (const r in TYPED_MESSAGE_SCHEMA.properties) e[r] && (t[r] = e[r]);
    return (
      "types" in t && (t.types = Object.assign({ EIP712Domain: [] }, t.types)),
      t
    );
  },
  sign(e, t = !0) {
    const r = this.sanitizeData(e),
      n = [Buffer.from("1901", "hex")];
    return (
      n.push(this.hashStruct("EIP712Domain", r.domain, r.types, t)),
      "EIP712Domain" !== r.primaryType &&
        n.push(this.hashStruct(r.primaryType, r.message, r.types, t)),
      keccak256(Buffer.concat(n))
    );
  },
};
function concatSig(e, t, r) {
  const n = ethUtil.fromSigned(t),
    i = ethUtil.fromSigned(r),
    o = ethUtil.bufferToInt(e),
    a = padWithZeroes(ethUtil.toUnsigned(n).toString("hex"), 64),
    s = padWithZeroes(ethUtil.toUnsigned(i).toString("hex"), 64),
    c = ethUtil.stripHexPrefix(ethUtil.intToHex(o));
  return ethUtil.addHexPrefix(a.concat(s, c)).toString("hex");
}

function padWithZeroes(e, t) {
  let r = "" + e;
  for (; r.length < t; ) r = "0" + r;
  return r;
}

export function signTypedData_v4(e, t) {
  const r = keccak256(t.data);
  console.log(typeof r, r);
  const n = ethUtil.ecsign(r, e);
  return ethUtil.bufferToHex(concatSig(n.v, n.r, n.s));
}
