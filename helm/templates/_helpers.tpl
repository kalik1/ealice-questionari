{{/*
Expand the name of the chart.
*/}}
{{- define "coop-questionari.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "coop-questionari.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "coop-questionari.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "coop-questionari.labels" -}}
helm.sh/chart: {{ include "coop-questionari.chart" . }}
{{ include "coop-questionari.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "coop-questionari.selectorLabels" -}}
app.kubernetes.io/name: {{ include "coop-questionari.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "coop-questionari.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "coop-questionari.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Generate database password if not provided
*/}}
{{- define "coop-questionari.databasePassword" -}}
{{- if .Values.postgresql.auth.password }}
{{- .Values.postgresql.auth.password }}
{{- else }}
{{- randAlphaNum 32 }}
{{- end }}
{{- end }}

{{/*
Generate JWT secret if not provided
*/}}
{{- define "coop-questionari.jwtSecret" -}}
{{- if .Values.backend.env.JWT_SECRET }}
{{- .Values.backend.env.JWT_SECRET }}
{{- else }}
{{- randAlphaNum 64 }}
{{- end }}
{{- end }}

{{/*
Generate postgres password if not provided
*/}}
{{- define "coop-questionari.postgresPassword" -}}
{{- if .Values.postgresql.auth.postgresPassword }}
{{- .Values.postgresql.auth.postgresPassword }}
{{- else }}
{{- randAlphaNum 32 }}
{{- end }}
{{- end }}
