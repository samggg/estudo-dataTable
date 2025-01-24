$(document).ready(function () {
    $("#filterButton").click(function () {
        putTable();
    });

    $("#exportCSV").click(function () {
        exportTableToCSV("exportacao_tabela.csv");
    });
});

function createTable(colums, data) {
    const table = $("<table></table>").attr("id", "exportTable");

    // Adiciona o cabeçalho
    const thead = $("<thead></thead>");
    const headerRow = $("<tr></tr>");
    colums.forEach(header => {
        $("<th></th>")
            .text(header)
            .css({
                "padding": "1.5rem",
                "font-size": "12px",
                "border": '1px solid #f4f4f4',
                "background-color": "green",
                "color": "white",
                "text-align": "center"
            })
            .appendTo(headerRow);
    });

    // Adiciona uma coluna oculta para IDs
    $("<th></th>").css("display", "none").appendTo(headerRow);

    thead.append(headerRow);
    table.append(thead);

    // Adiciona o corpo
    const tbody = $("<tbody></tbody>");
    data.forEach((row, index) => {
        const tr = $("<tr></tr>");
        row.forEach(cell => {
            $("<td></td>")
                .text(cell)
                .css({
                    "padding": "8px"
                })
                .appendTo(tr);
        });

        $("<td></td>")
            .text(index)
            .css("display", "none")
            .appendTo(tr);

        tbody.append(tr);
    });
    table.append(tbody);

    return table;
}

function putTable() {
    $("#tableContainer").html("");

    const colums = [
        "App", "Ano", "Mês", "Nome da Empresa", "Matricula", "Rubrica",
        "Responsável", "Gerente", "Cod.Cent de Custo", 
        "Cent de Custo Base RH", "ID da viagem", "Justificativa"
    ];

    const linha = [
        ["99", "2024", "AGOSTO", "SIDIA", "53240612", "FUNDING", "SAMUEL", "ARLINDO", "11126", "11126", "DCJNNUCC93-DD", "INDO PARA O SIDIA"],
        ["UBER", "2024", "SETEMBRO", "SAMSUNG", "51253009", "GA", "SAMUEL", "MAURO", "11236", "11236", "CEI7328CDCD-2D", "INDO PARA CASA"],
        ["UBER", "2023", "JULHO", "AMAZON", "12345678", "GA", "ANA", "CARLOS", "11256", "11256", "CEI1234", "INDO PARA O TRABALHO"],
    ];

    const table = $("<table></table>").attr("id", "exportTable").addClass("display");

    // Cria o cabeçalho
    const thead = $("<thead></thead>");
    const headerRow = $("<tr></tr>");
    colums.forEach((header, index) => {
        const th = $("<th></th>")
            .css({
                "padding": "1.5rem",
                "font-size": "12px",
                "border": '1px solid #f4f4f4',
                "background-color": "green",
                "color": "white",
                "text-align": "center",
                "position": "relative"
            })
            .text(header);

        
        const icon = $('<span class="filter-icon" style="cursor: pointer; margin-left: 8px;">&#128269;</span>')
            .on('click', function () {
                showFilterModal(index, dataTable, $(this));
            });

        th.append(icon); 
        headerRow.append(th);
    });
    thead.append(headerRow);
    table.append(thead);

    // Cria o corpo
    const tbody = $("<tbody></tbody>");
    linha.forEach(row => {
        const tr = $("<tr></tr>");
        row.forEach(cell => {
            $("<td></td>")
                .text(cell)
                .css({
                    "padding": "8px",
                    "text-align": "center"
                })
                .appendTo(tr);
        });
        tbody.append(tr);
    });
    table.append(tbody);

    $("#tableContainer").append(table);

    const dataTable = $("#exportTable").DataTable({
        dom: 'Bfrtip',
        paging: true,
        scroll: "50vh",
        scrollCollapse: true,
        scrollX: true,
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
                previous: "Anterior"
            }
        },
        columnDefs: [
            {
                targets: "_all",
                className: "dt-body-nowrap"
            }
        ]
    });
    

    
    $(document).on('click', function () {
        $(".filter-modal").remove();
    });
}


function showFilterModal(columnIndex, dataTable, iconElement) {
    
    $(".filter-modal").remove();

    
    const modal = $('<div class="filter-modal"></div>').css({
        position: "absolute",
        top: iconElement.offset().top + iconElement.height() + 5,
        left: iconElement.offset().left,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "10px",
        zIndex: 1000,
        width: "7rem"
    });

    
    const selectAllCheckbox = $(`
        <label style="display: block; margin: 5px 0; font-size: 11px">
            <input type="checkbox" id="selectAllCheckbox">
            Selecionar Todos
        </label>
    `).on('change', function () {
        if($("#selectAllCheckbox").is(":checked") == true){
            modal.find("input[type='checkbox']").each(function () {
                $(this).prop("checked", true);
            });
        }else{
            modal.find("input[type='checkbox']").each(function () {
                $(this).prop("checked", false);
            });
        }
    });
    
    
    modal.append(selectAllCheckbox);
    
    
    const column = dataTable.column(columnIndex);
    column.data().unique().sort().each(function (d) {
        const checkbox = $(`
            <label style="display: block; margin: 5px 0; font-size: 11px;">
                <input type="checkbox" value="${d}" class="filter-checkbox">
                ${d}
            </label>
        `);
        modal.append(checkbox);
    });

    const applyButton = $('<button style="margin-top: 10px; padding: 5px 10px; cursor: pointer;">Filtrar</button>')
        .on('click', function () {
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

    // Previne o fechamento do modal ao clicar dentro dele
    modal.on('click', function (e) {
        e.stopPropagation();
    });
}



function exportTableToCSV(filename) {
    const table = document.getElementById('exportTable');
    const rows = table.querySelectorAll('tr');
    const csv = [];

    // Verifica o separador padrão (vírgula ou ponto e vírgula)
    const separator = navigator.language === 'pt-BR' ? ';' : ',';

    // Percorre as linhas da tabela
    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('th, td'));
        const rowData = cells.map(cell => {
            let text = cell.textContent.trim();
            
            // Escapa aspas duplas no conteúdo
            if (text.includes('"')) {
                text = text.replace(/"/g, '""');
            }

            // Envolve valores entre aspas duplas
            return `"${text}"`;
        });
        csv.push(rowData.join(separator)); // Junta as células com o separador apropriado
    });

    // Cria o conteúdo do arquivo CSV
    const csvContent = csv.join('\r\n'); // Linha por linha separada por "\r\n" para maior compatibilidade

    // Gera um arquivo Blob no formato CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Cria um link de download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';

    // Adiciona o link ao documento e dispara o download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
