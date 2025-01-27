var colums = [
  "App",
  "Ano",
  "Mês",
  "Nome da Empresa",
  "Matricula",
  "Rubrica",
  "Responsável",
  "Gerente",
  "Cod.Cent de Custo",
  "Cent de Custo Base RH",
  "ID da viagem",
  "Justificativa",
];

var linha = [
  [
    "99",
    "2024",
    "AGOSTO",
    "INFOMAÇÕES",
    "53240612",
    "INFORMAÇÕES",
    "SAMUEL MONTEIRO GOMES",
    "ARLINDO NETO",
    "11126",
    "11126",
    "DCJNNUCC93-DD",
    "SE DESLOCANDO PARA O TRABALHO",
  ],
  [
    "UBER",
    "2024",
    "SETEMBRO",
    "UNIVERSIDADE FEDERAL DO AMAZONAS",
    "51253009",
    "GA",
    "SAMUEL MONTEIRO GOMESS",
    "MAURO",
    "11236",
    "11236",
    "CEI7328CDCD-2D",
    "INDO PARA CASA",
  ],
  [
    "UBER",
    "2023",
    "JULHO",
    "AMAZON",
    "12345678",
    "GA",
    "ANA",
    "CARLOS",
    "11256",
    "11256",
    "CEI1234",
    "INDO PARA O TRABALHO",
  ],
];

$(document).ready(function () {
  putTable(colums, linha);
});

function putTable() {
  $("#tableContainer").html("");

  const table = $("<table></table>") .attr("id", "exportTable")
  const thead = $("<thead></thead>");
  const headerRow = $("<tr></tr>");
  colums.forEach((header, index) => {
    const th = $("<th></th>")
      .css({
        "padding": "0.5rem",
        "font-size": "12px",
        "background-color": "#000000",
        "color": "white",
        "text-align": "center",
      })
      .text(header);

    const icon = $(
      '<span class="filter-icon" style="cursor: pointer; margin-left: 8px;"><i class="fi fi-rs-angle-down"></i></span>'
    ).on("click", function () {
      showFilterModal(index, dataTable, $(this));
    });

    th.append(icon);
    headerRow.append(th);
  });
  thead.append(headerRow);
  table.append(thead);

  // Cria o corpo
  const tbody = $("<tbody></tbody>");
  linha.forEach((row) => {
    const tr = $("<tr></tr>");
    row.forEach((cell) => {
      const td = $("<td></td>").text(cell).css({
        "padding": "1.8rem",
        "text-align": "center",
        "white-space": "nowrap",
        "overflow": "hidden",
        "text-overflow": "ellipsis",
        "min-width": "100px",
      });
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);

  $("#tableContainer").append(table);

  const dataTable = $("#exportTable").DataTable({
    dom: "Bfrtip",
    paging: true,
    scroll: "50vh",
    scrollCollapse: true,
    scrollX: true,
    autoWidth: false,
    ordering: false,
    language: {
      lengthMenu: "Mostrar _MENU_ registros por página",
      zeroRecords: "Nenhum registro encontrado",
      info: "Mostrando página _PAGE_ de _PAGES_",
      search: "Buscar:",
      paginate: {
        first: "Primeiro",
        last: "Último",
        next: "Próximo",
        previous: "Anterior",
      },
    },
    columnDefs: [
      {
        className: "dt-body-nowrap",
        targets: 3, width: "300px" // Exemplo: Coluna "Nome da Empresa".
      },
    ],
  });
}

//função para mostrar filtro que nem o do Excel
function showFilterModal(columnIndex, dataTable, iconElement) {
  const viewModal = $(".filter-modal");

  if (viewModal.length && viewModal.is(":visible")) {
    $(".filter-modal").remove();
    return;
  }

  $(".filter-modal").remove();

  const modal = $('<div class="filter-modal"></div>').css({
    position: "absolute",
    top: iconElement.offset().top + iconElement.height() + 5,
    left: iconElement.offset().left,
    "background-color": "#000000",
    "color": "white",
    "border": "1px solid #ccc",
    "boxShadow": "0 4px 6px rgba(0, 0, 0, 0.1)",
    "padding": "10px",
    "border-radius": "8px",
    "width": "7rem",
  });

  const selectAllCheckbox = $(`
        <label style="display: block; margin: 5px 0; font-size: 11px">
            <input type="checkbox" id="selectAllCheckbox">
            Selecionar Todos
        </label>
    `).on("change", function () {
    if ($("#selectAllCheckbox").is(":checked") == true) {
      modal.find("input[type='checkbox']").each(function () {
        $(this).prop("checked", true);
      });
    } else {
      modal.find("input[type='checkbox']").each(function () {
        $(this).prop("checked", false);
      });
    }
  });

  modal.append(selectAllCheckbox);

  const column = dataTable.column(columnIndex);
  column
    .data()
    .unique()
    .sort()
    .each(function (d) {
      const checkbox = $(`
            <label style="display: block; margin: 5px 0; font-size: 11px;">
                <input type="checkbox" value="${d}" class="filter-checkbox">
                ${d}
            </label>
        `);
      modal.append(checkbox);
    });

  const applyButton = $(
    '<button class="style-button">Filtrar</button>'
  ).on("click", function () {
    const selectedValues = [];
    modal.find(".filter-checkbox:checked").each(function () {
      selectedValues.push($.fn.dataTable.util.escapeRegex($(this).val()));
    });

    const searchValue = selectedValues.length
      ? `^(${selectedValues.join("|")})$`
      : "";
    column.search(searchValue, true, false).draw();
    modal.remove();
  });

  modal.append(applyButton);
  $("body").append(modal);

  modal.on("click", function (e) {
    e.stopPropagation();
  });
}
