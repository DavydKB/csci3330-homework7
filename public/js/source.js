$(function () {
    // *********************************************************************
    // Feel free to modify/remove the JS objects below.
    // *********************************************************************

    let username = "UTRGV Vaqueros";
    let currentCustomerPage = 1;
    let totalCustomerPages = 1;

    const userNameObj = $("#username");
    userNameObj.append(`${username}`);

    const getRevenue = async()=>{
        console.log("Retrieving total revenue...");

        try{
            const response = await fetch("/sales/total");

            if(!response.ok){
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();
            const revenue = Number(data.sum);

            $(".revenue-amt").text(`$${revenue.toLocaleString()}`);
        }
        catch(err){
            console.error("Error retrieving revenue:", err);
        }
    };

    const getCustomerCount = async()=>{
        console.log("Retrieving customer count...");

        try{
            const response = await fetch("/customers/count");

            if(!response.ok){
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();

            $("#customer-num").text(Number(data.count).toLocaleString());
        }
        catch(err){
            console.error("Error retrieving customers:", err);
        }
    };

    const getOrderCount = async()=>{
        console.log("Retrieving total order quantity...");

        try{
            const response = await fetch("/orders/count");

            if(!response.ok){
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();
            const ordersAmt = Number(data.count);

            $("#orders-amt").text(ordersAmt.toLocaleString());
        }
        catch(err){
            console.error("Error retrieving orders:", err);
        }
    };

    const getIssueCount = async()=>{
        console.log("Retrieving issue count...");

        try{
            const response = await fetch("/alerts/issues/count");

            if(!response.ok){
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();

            $("#issues-amt").text(Number(data.count).toLocaleString());
        }
        catch(err){
            console.error("Error retrieving issues:", err);
        }
    };

    const getNotificationCount = async()=>{
        console.log("Retrieving notification count...");

        try{
            const response = await fetch("/alerts/notifications/count");

            if(!response.ok){
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();

            $("#notification-num").text(Number(data.count).toLocaleString());
        }
        catch(err){
            console.error("Error retrieving notifications:", err);
        }
    };

    const getCustomers = async()=>{
        try{
            const response = await fetch(`/customers?page=${currentCustomerPage}`);

            if(!response.ok){
                throw new Error("Failed to retrieve customers.");
            }

            const data = await response.json();

            const customers = data.customers;
            currentCustomerPage = data.currentPage;
            totalCustomerPages = data.totalPages;

            const customerTableBody = $("#customerTableBody");
            customerTableBody.empty();

            customers.forEach(customer=>{
                const row = `
                    <tr>
                        <td>${customer.name}</td>
                        <td>${customer.email}</td>
                        <td>
                            <span class="status-${customer.status.toLowerCase()}">
                                ${customer.status}
                            </span>
                        </td>
                        <td>${new Date(customer.datejoined).toLocaleDateString()}</td>
                    </tr>
                `;

                customerTableBody.append(row);
            });


            const pageGroup = Math.ceil(currentCustomerPage / 10);
            const firstPage = (pageGroup - 1) * 10 + 1;
            const lastPage = Math.min(firstPage + 9, totalCustomerPages);

            const pageNumbers = $("#page-numbers");
            pageNumbers.empty();

            for(let i = firstPage; i <= lastPage; i++){
                const pageLink = $("<a>")
                    .attr("href", "#")
                    .text(i);

                if(i === currentCustomerPage){
                    pageLink.addClass("active");
                }

                pageLink.on("click", (event)=>{
                    event.preventDefault();
                    currentCustomerPage = i;
                    getCustomers();
                });

                pageNumbers.append(pageLink);
            }


            $("#previous-page").toggleClass("disabled", firstPage === 1);
            $("#next-page").toggleClass("disabled", lastPage === totalCustomerPages);
        }
        catch(err){
            console.error("Error retrieving customers:", err);
        }
    };

    const getSales = async()=>{
        console.log("Retrieving sales records...");

        try{
            const response = await fetch("/sales");

            if(!response.ok){
                throw new Error(`HTTP error: ${response.status}`);
            }

            const sales = await response.json();
            const tableBody = $("#salesTableBody");

            tableBody.empty();

            sales.forEach(sale=>{
                const row = $("<tr>");

                row.html(`
                    <td>${sale.name}</td>
                    <td>${sale.quantity}</td>
                    <td>$${Number(sale.saleamount).toLocaleString()}</td>
                `);

                tableBody.append(row);
            });
        }
        catch(err){
            console.error("Error retrieving sales:", err);
        }
    };

    const getIssues = async()=>{
        console.log("Retrieving issues...");

        try{
            const response = await fetch("/alerts/issues");

            if(!response.ok){
                throw new Error(`HTTP error: ${response.status}`);
            }

            const issues = await response.json();
            const issueList = $("#system-status-list");

            issueList.empty();

            issues.forEach(issue=>{
                const li = $("<li>");
                li.text(issue.description);

                issueList.append(li);
            });
        }
        catch(err){
            console.error("Error retrieving issues:", err);
        }
    };

    const getNotifications = async()=>{
        console.log("Retrieving notifications...");

        try{
            const response = await fetch("/alerts/notifications");

            if(!response.ok){
                throw new Error(`HTTP error: ${response.status}`);
            }

            const notifications = await response.json();
            const notificationList = $("#notifications-list");

            notificationList.empty();

            notifications.forEach(notification=>{
                const li = $("<li>");
                li.text(notification.description);

                notificationList.append(li);
            });
        }
        catch(err){
            console.error("Error retrieving notifications:", err);
        }
    };

    const getTasks = async()=>{
        console.log("Retrieving tasks...");

        try{
            const response = await fetch("/alerts/tasks");

            if(!response.ok){
                throw new Error(`HTTP error: ${response.status}`);
            }

            const tasks = await response.json();
            const taskList = $("#tasks-list");

            taskList.empty();

            tasks.forEach(task=>{
                const li = $("<li>");
                li.text(task.description);

                taskList.append(li);
            });
        }
        catch(err){
            console.error("Error retrieving tasks:", err);
        }
    };

    // All six jQuery UI functions

    $("button").button();

    $("#dashboardTabs").tabs();

    $("#customerDate").datepicker();

    $("#accordion").accordion({
        collapsible: true,
        heightStyle: "content"
    });

    $("#customerDialog").dialog({
        autoOpen: false,
        modal: true,
        width: 450,
        buttons: {
            "Create Customer": function () {
                var name = $("#customerName").val();
                var email = $("#customerEmail").val();

                if(!name || !email){
                    alert("Please enter a name and email.");
                    return;
                }

                alert("Customer created: " + name);
                $(this).dialog("close");
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        }
    });

    $("#newCustomerButton").on("click", function () {
        $("#customerDialog").dialog("open");
    });

    $("#previous-page").on("click", (event)=>{
        event.preventDefault();

        if(currentCustomerPage > 1){
            currentCustomerPage = Math.max(1, Math.floor((currentCustomerPage - 1) / 10) * 10);
            getCustomers();
        }
    });

    $("#next-page").on("click", (event)=>{
        event.preventDefault();

        if(currentCustomerPage < totalCustomerPages){
            currentCustomerPage = Math.floor((currentCustomerPage - 1) / 10) * 10 + 11;
            getCustomers();
        }
    });

    getRevenue();
    getCustomerCount();
    getOrderCount();
    getIssueCount();
    getNotificationCount();
    getCustomers();
    getSales();
    getIssues();
    getNotifications();
    getTasks();
});
