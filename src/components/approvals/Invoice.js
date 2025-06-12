import React, { Component } from "react";

const colors = {
    "APPROVED_HERE": "grey",
    "UNAPPROVED_READY": "green",
    "UNAPPROVABLE": "red"
}


class Invoice extends Component {
  render() {
    const orgUnits = this.props.invoice.orgUnits;
    const zoneDeSantes = orgUnits.filter((ou) => ou.codes.includes("zs"));
    return (
      <div id="invoiceFrame">
        <h1>
          Data Approval : {zoneDeSantes.length} at {this.props.invoice.period}
        </h1>

        <table>
          <thead>
            <tr>
              <th>Hierachie</th>
              <th>OrgUnit</th>
              <th>Contract</th>
              <th>Approved, Unapprovable, Unapproved ready.</th>
            </tr>
          </thead>
          <tbody>
            {zoneDeSantes.map((orgUnit) => (
              <tr>
                <td>
                  {orgUnit.ancestors
                    .slice(1, orgUnit.ancestors.length - 1)
                    .map((a, index) => (
                      <React.Fragment>
                        <a
                          href={
                            "./index.html#/reports/" +
                            this.props.invoice.period +
                            "/" +
                            a.id +
                            "/approvals"
                          }
                          style={{ fontSize: "8px" }}
                        >
                          {a.name}
                        </a>
                        {index < orgUnit.ancestors.length - 3 && (
                          <span>{" > "}</span>
                        )}
                      </React.Fragment>
                    ))}
                </td>
                <td>
                  <a
                    href={
                      "./index.html#/reports/" +
                      this.props.invoice.period +
                      "/" +
                      orgUnit.id +
                      "/approvals"
                    }
                    style={{ fontSize: "8px" }}
                  >
                    {orgUnit.name}
                  </a>
                </td>

                <td>{orgUnit.codes.join(" ")}</td>
                <td>
                  {this.props.invoice.currentApprovals &&
                    this.props.invoice.currentApprovals
                      .filter((a) => a.orgUnit == orgUnit.id)
                      .map((a) => (
                        <span
                          style={{
                            color: colors[a.state],
                            fontStyle: a.mayApprove ? "italic" : "normal",
                          }}
                          title={
                            (a.state) +
                            " " +
                            JSON.stringify(a)
                          }
                        >
                          {a.period}&nbsp;
                        </span>
                      ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Invoice;
