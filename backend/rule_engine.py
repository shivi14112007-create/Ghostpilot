def evaluate_network(latency, packet_loss, cpu, risk):

    if (
        risk <= 30
        and latency < 30
        and packet_loss == 0
        and cpu < 50
    ):
        status = "Healthy"

    elif (
        risk <= 70
        and latency <= 70
        and packet_loss <= 3
        and cpu <= 80
    ):
        status = "Warning"

    else:
        status = "Critical"

    return status