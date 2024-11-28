# Start with an official Ubuntu base image
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y postfix && apt install -y rsyslog

# # Run iptables commands to configure network rules (requires elevated privileges)
# RUN apt install -y iptables
# RUN ip6tables -I OUTPUT -p tcp --dport 25 -j DROP && \
#     iptables -t nat -I OUTPUT -o ens3 -p tcp --dport 25 -j DNAT --to-destination 130.245.136.123:11587

COPY main.cf /etc/postfix/main.cf
COPY mailname /etc/mailname

# Expose Postfix SMTP port
EXPOSE 25
EXPOSE 587

RUN rsyslogd

CMD ["postfix", "start-fg"]

# # Keep container alive
# CMD ["tail", "-f", "/dev/null"]